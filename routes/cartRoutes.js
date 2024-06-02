
const router = require('express').Router();
const cartController = require('../controller/cartController');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/addToCart/:userId',authMiddleware,  cartController.addToCart)

router.post('/:userId',authMiddleware,  cartController.createOrUpdateCart)

router.get('/:userId',authMiddleware,  cartController.getUserCart);

// DELETE /api/cart/deleteFromCart/:userId/:productId
router.delete('/:productId/:userId', authMiddleware, cartController.removeFromCart);

router.delete('/:uid', authMiddleware, cartController.deleteAllCartItemsForUser)


module.exports = router;
