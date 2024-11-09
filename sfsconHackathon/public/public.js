
function renderHTML(styleSheet, html) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NDS - Network Device Scanner</title>
            <link rel="stylesheet" href="${styleSheet}">
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;
}
 

module.exports = renderHTML;
