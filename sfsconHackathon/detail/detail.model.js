const { exec } = require('child_process');

async function fetchAndProcessCVEs(ip) {

    operatingSystem = "Unknown OS";

    try {
        const nmapResult = await new Promise((resolve, reject) => {
            exec(`sudo nmap -O ${ip}`, (error, stdout, stderr) => {
                if (error) {
                    reject(`Fehler: ${stderr}`);
                } else {
                    resolve(stdout);
                }
            });
        });

        const osMatch = nmapResult.match(/OS details: ([^\n]*)/);
        operatingSystem = osMatch ? osMatch[1] : "Unknown OS";
    } catch (error) {
        console.error(error);
    }
    
    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${operatingSystem}&keywordExactMatch`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.vulnerabilities) {
            throw new Error("Recieved empty or invalid data.");
        }
        
        const networkVulnerabilities = data.vulnerabilities
            .filter(vuln => 
                vuln.cve.metrics &&
                vuln.cve.metrics.cvssMetricV2 &&
                vuln.cve.metrics.cvssMetricV2.some(metric => 
                    metric.cvssData.accessVector === "NETWORK"
                ) &&
                new Date(vuln.cve.lastModified).getFullYear() >= 2018
            )
            .sort((a, b) => {
                const scoreA = (a.cve.metrics.cvssMetricV2 && a.cve.metrics.cvssMetricV2[0]?.cvssData?.baseScore) || 0;
                const scoreB = (b.cve.metrics.cvssMetricV2 && b.cve.metrics.cvssMetricV2[0]?.cvssData?.baseScore) || 0;
                
                return scoreB - scoreA;
            });

        return extractVulnerabilityData(networkVulnerabilities);
    } catch (error) {
        console.error("Error retrieving data:", error);
    }
}

// Funktion, um die relevanten Daten zu extrahieren
function extractVulnerabilityData(jsonData) {
  return jsonData.map(item => {
    const cveData = item.cve;
    const description = cveData.descriptions.find(desc => desc.lang === "en")?.value || "No description";
    const cvssMetric = cveData.metrics.cvssMetricV31 ? cveData.metrics.cvssMetricV31[0] : cveData.metrics.cvssMetricV2[0];
    const severity = cvssMetric?.baseSeverity || "N/A";
    const score = cvssMetric?.cvssData?.baseScore || "N/A";

    return {
      cve_id: cveData.id,
      lastModified: cveData.lastModified,
      vulnStatus: cveData.vulnStatus,
      description: description,
      severity,
      score
    };
  });
}

module.exports = { fetchAndProcessCVEs };


