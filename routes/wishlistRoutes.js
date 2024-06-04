const router = require('express').Router();
const favoriteController = require('../controller/wishlistController');
const  authMiddleware  = require('../middleware/authmiddleware');

// Add product to favorites
router.post('/', authMiddleware, favoriteController.addToFavorites);

// Get user's favorite products
router.get('/', authMiddleware, favoriteController.getFavorites);

// Remove product from
router.delete('/:userId/:productId', authMiddleware, favoriteController.removeSingleFavoriteById);

// Delete all favorite items for a user
router.delete('/:userId', favoriteController.deleteAllFavoritesById);


module.exports = router;
