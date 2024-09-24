'use strict';

const express = require('express');
const config = require('./config');

const app = express();
const port = config.port;

// setup
app.set('view engine', 'ejs');
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
    res.render('index', {'apiBaseUrl': config.api.baseUrl});
});

// startup
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
