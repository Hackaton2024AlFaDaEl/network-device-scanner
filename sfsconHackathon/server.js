const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // You can choose any port
const container = require('./container/container.controller');
const bodyParser = require('body-parser');

// Use Express to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Route for the root URL ("/") to serve the HTML file
app.get('/', (req, res) => {
    container.startNetwork(req, res);
});

// Start the server and listen on the specified port and 0.0.0.0 address
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
    console.log(`Access it on your local IP address at http://YOUR_IP_ADDRESS:${port}`);
});