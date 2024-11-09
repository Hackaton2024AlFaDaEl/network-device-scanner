const renderHTML = require('../public/public');

function renderView(deviceArr) {
    return renderHTML("container.css", `
        <link rel="stylesheet" href="./container.css" type="text/css">
        <div class="top-bar">
            <img class="top-bar" src="header.png">
            <img id="icon" src="icon.png">
        </div>

        <div class="devices-container">
            ${deviceArr.map(d => renderDeviceCard(d)).join('')}
        </div>
    `);
}


function renderDeviceCard(device) {
    return `
        <a href="/detail?ip=${device.ip}" class="device-box">
            <div class="device-details">
                <span class="device-ip">IP: ${device.ip}</span>
                <span class="device-mac">MAC: ${device.mac}</span>
                <span class="device-manufacturer">Manufacturer: ${device.manufacture}</span>
            </div>
        </a>
    `;
}


module.exports = { renderView }
