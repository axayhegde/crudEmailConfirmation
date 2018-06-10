const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const port = 3000;


const httpsOptions = {
    key : fs.readFileSync('./key.pem'),
    cert : fs.readFileSync('./cert.pem')
}

app.get('/', (req, res) => res.send('Hello World!'));


app.get('/test', (req, res) => res.send(httpsOptions));


const server = https.createServer(httpsOptions, app).listen(port, () => {
    console.log('server running ' + port);
})