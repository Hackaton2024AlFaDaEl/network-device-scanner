const ping = require('ping');
const arp = require('node-arp');
const os = require('os');
const https = require('https');
const { Subject, firstValueFrom } = require('rxjs');

function getLocalNetworkRange() {
    const interfaces = os.networkInterfaces();
    for (let iface in interfaces) {
        for (let i of interfaces[iface]) {
            if (i.family === 'IPv4' && !i.internal) {
                const parts = i.address.split('.');
                parts[3] = '0'; // Set the base IP address to start scanning
                return parts.join('.');
            }
        }
    }
    return null;
}

const networkBase = getLocalNetworkRange();
if (!networkBase) {
    console.error('Unable to detect local network range.');
    process.exit(1);
}

async function getManufacture(mac) {
    const apiKey = "01jc76e8szh5jd4bj537a845dm01jc76fm3y6rjeawasj2yj0af6z7p3z9omfsdb";
    const url = "https://api.maclookup.app/v2/macs"
    let sub = new Subject();
    let response = "";
    https.get(`${url}/${mac}?apiKey=${apiKey}`, res => {
        res.on("data", res => response += res)
        res.on("end", () => {
            response = JSON.parse(response);
            response = response.company;
            sub.next(null)
        })
    }).on("error", err => console.error(err));
    await firstValueFrom(sub.asObservable());
    return response;
}

async function scanNetwork() {
    const subnet = networkBase.slice(0, networkBase.lastIndexOf('.') + 1);
    const promises = [];

    for (let i = 1; i < 255; i++) {
        const ip = `${subnet}${i}`;
        promises.push(
            new Promise((resolve) => {
                ping.promise.probe(ip, { timeout: 1 })
                    .then(res => res.alive 
                        ? arp.getMAC(ip, async (err, mac) => 
                            resolve({ 
                            ip, 
                            mac: mac || 'N/A', 
                            manufacture: mac ? 
                                await getManufacture(mac) : 
                                "N/A"}))
                        :resolve(null)
                    );
            })
        );
    }

    let networks = await Promise.all(promises);
    network = networks.filter(net => net != null)

    return network;
}

module.exports = { scanNetwork };