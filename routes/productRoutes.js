const router = require('express').Router();
const productController = require('../controller/productController');
const authMiddleware = require('../middleware/authmiddleware');

// Create product route
router.post('/post', authMiddleware, productController.createProduct);

// Admin route to get all products
router.get('/', authMiddleware, productController.getProductsAdmin);

router.get('/trending_products', productController.getTrendingProducts);
router.get('/featured_products', productController.getFeaturedProducts);

// Get single product by productId route
router.get('/singleProduct/:productId', productController.getProduct);

// Get all categories route
router.get('/categories', productController.getAllCategories);

router.get('/search_products', productController.searchProducts);
// Get products by ownerId route
router.get('/:ownerId', productController.getProducts);

// Filter products by category route
router.get('/get_product_by_category/:category', productController.getProductsByCategory);

// Example of a search route (if needed)

module.exports = router;
