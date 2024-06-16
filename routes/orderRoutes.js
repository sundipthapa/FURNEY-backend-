// const router = require('express').Router();
// const orderController = require('../controller/orderController')

// //* create order
// router.post("/create_order", orderController.createOrder)

// //* get orders
// router.get("/get_all_orders", orderController.getOrders);


// router.get("/get_order_by_id/:userId", orderController.getOrdersByUserId);




// module.exports = router;

var express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const orderController = require('../controller/orderController');
var router = express.Router();

router.get(
    '/:userId',
    authMiddleware,
    orderController.getAllOrders
);

router.post(
    '/create/:userId',
    authMiddleware,
    orderController.createOrder
);

router.put(
    '/:orderId/:userId',
    authMiddleware,
    orderController.updateOrder
);

router.delete(
    '/:orderId/:userId',
    authMiddleware,
    orderController.deleteOrder
);


module.exports = router;