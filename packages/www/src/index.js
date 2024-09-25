'use strict';

const express = require('express');
const {'Proxy': proxy} = require('axios-express-proxy');
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

app.post('/upload', (req, res) => proxy(`${apiBaseUrl}/upload`, req, res));
app.get('/download', (req, res) => proxy(`${apiBaseUrl}/download`, req, res));

// startup
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
