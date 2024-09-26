'use strict';

const express = require('express');
// const {'Proxy': proxy} = require('axios-express-proxy');
const proxy = require('express-http-proxy');
const config = require('./config');

const app = express();
const port = config.port;
const apiBaseUrl = config.api.baseUrl;

// setup
app.set('view engine', 'ejs');
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
    res.render('index', {'apiBaseUrl': config.api.baseUrl});
});

app.post('/upload', proxy(`${apiBaseUrl}/upload`, {
    limit: '15mb'
}));

app.get('/download/:processId', proxy(`${apiBaseUrl}`, {
    'proxyReqPathResolver'(req) {
        // Extract processId from request parameters
        const processId = req.params.processId;

        // Return the full path to the external API, dynamically including the processId
        return `/download/${processId}`;
      }
}));


// startup
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
