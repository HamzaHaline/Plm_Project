// filename: health_check.js

const express = require('express');
const app = express();

app.use(express.static('static'));
app.get('/health-check', (req, res) => res.sendStatus(200));

app.listen(80);
