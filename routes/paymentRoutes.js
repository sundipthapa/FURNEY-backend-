const express = require('express');
const router = express.Router();

const { verifyPayment } = require('../controller/esewa');
const { getOrderForPayment } = require('../controller/orderController');
const { createPayment } = require('../controller/paymentController');

router.post(
    '/verify-payment',
    verifyPayment,
    getOrderForPayment,
    createPayment
);


module.exports = router;