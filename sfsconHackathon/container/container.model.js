const ping = require('ping');
const arp = require('node-arp');
const os = require('os');
const https = require('https');
const { last, Observable } = require('rxjs');

function getLocalNetworkRange() {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
        for (const i of interfaces[iface]) {
            if (i.family === 'IPv4' && !i.internal) {
                return i;
            }
        }
    }
    return null;
}

function calcNetworkAddress(ip, netmask) {
    const ipParts = ip.split('.').map(Number);
    const netmaskParts = netmask.split('.').map(Number);
    return ipParts.map((part, index) => part & netmaskParts[index]).join('.');
}

function calcBroadcastAddress(ip, subnetMask) {
    const ipParts = ip.split('.').map(Number);
    const subnetMaskParts = subnetMask.split('.').map(Number);

    // Calculate inverted subnet mask
    const invertedSubnetMaskParts = subnetMaskParts.map(part => ~part & 255);

    // Calculate broadcast address by applying OR between IP and inverted subnet mask
    const broadcastAddressParts = ipParts.map((part, index) => part | invertedSubnetMaskParts[index]);

    // Convert back to a dotted decimal string
    return broadcastAddressParts.join('.');
}

let count = 0;

async function getManufacture(mac) {
    const apiKey = "01jc76e8szh5jd4bj537a845dm01jc76fm3y6rjeawasj2yj0af6z7p3z9omfsdb";
    const url = `https://api.maclookup.app/v2/macs/${mac}?apiKey=${apiKey}`;
    count++;
    if (count > 50) {
        await new Promise(r => setTimeout(r, 1000));
        count = 0;
    }

    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response.company || 'Unknown');
                } catch (error) {
                    reject('Parse Error');
                }
            });
        }).on('error', d => console.error("do isch a fehelr"));
    });
}

function ipAddrAddOne(ip) {
    const segments = ip.split('.').map(Number);
    for (let i = segments.length - 1; i >= 0; i--) {
        if (segments[i] < 255) {
            segments[i]++;
            break;
        } else {
            segments[i] = 0;
        }
    }
    return segments.join('.');
}

async function scanNetwork() {
    const networkBase = getLocalNetworkRange();
    if (!networkBase) return [];
    
    const networkStart = calcNetworkAddress(networkBase.address, networkBase.netmask);
    const broadcast = calcBroadcastAddress(networkBase.address, networkBase.netmask);
    
    let currentIp = networkStart;
    let promises = [];

    while (currentIp !== broadcast) {
        promises.push(new Promise((resolve) => {
            ping.promise.probe(currentIp, { timeout: 1 }).then(async (res) => {
                if (res.alive) {
                    arp.getMAC(res.inputHost, async (err, mac) => {
                        const manufacture = mac ? await getManufacture(mac) : "N/A";
                        resolve({ ip: res.inputHost, mac: mac || 'N/A', manufacture });
                    });
                } else {
                    resolve(null);
                }
            }).catch(() => resolve(null));
        }));
        currentIp = ipAddrAddOne(currentIp);
    }

    const networks = (await Promise.all(promises)).filter(net => net !== null);
    return networks;
}

module.exports = { scanNetwork };