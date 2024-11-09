const renderHTML = require('../public/public');

function renderView(vulnerArr) {
    return renderHTML("detail.css", `
        <link rel="stylesheet" href="./detail.css" type="text/css">
        <div class="top-bar">
            <h1>NDS (Network Device Scanner)</h1>
            <img src="https://via.placeholder.com/40" alt="Website Logo" title="Website Logo">
        </div>

        <div class="vulners-container">
            ${vulnerArr.map(d => renderVulnerCard(d)).join('')}
        </div>
    `);
}


function renderVulnerCard(vulner) {
    return `
        <div class="vulners-details vulner-box">
            <span class="vulner-id">CVE-ID: ${vulner.cve_id}</span>
            <span class="vulner-lastModified">Last modified: ${vulner.lastModified}</span>
            <span class="vulner-status">CVE-Status: ${vulner.vulnStatus}</span>
            <span class="vulner-description">Description: ${vulner.description}</span>
            <span class="vulner-severity">Severity: ${vulner.severity} - ${vulner.score}</span>
        </div>
    `;
}


module.exports = { renderView }