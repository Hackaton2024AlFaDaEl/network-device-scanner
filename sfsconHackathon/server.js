const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // You can choose any port

// Use Express to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL ("/") to serve the HTML file
app.get('/', (redq, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and listen on the specified port and 0.0.0.0 address
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
    console.log(`Access it on your local IP address at http://YOUR_IP_ADDRESS:${port}`);
});