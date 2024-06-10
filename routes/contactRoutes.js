// routes/contactRoutes.js
const express = require('express');
const { sendContactMessage } = require('../controller/contactController');

const router = express.Router();

router.post('/contact', sendContactMessage);

module.exports = router;
