const Cart = require('../model/cartModel');
const Product = require('../model/productModel'); // Adjust the path as per your project structure



exports.addToCart = async (req, res) => {

  console.log("Product ID:  " , req.body.product)
  try {
      let cart = await Cart.findOne({ user: req.user.id })
      if (!cart) {
          cart = new Cart({ user: req.user.id, products: [] })
      }
      const existingProductIndex = cart.products.
          findIndex(product => product.product.toString() === req.body.product)

      if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += 1
      } else {
          cart.products.push({ product: req.body.product, quantity: 1 })
      }

      const createdCart = await cart.save()
      res.json({ message: 'Added To Cart Created Sucessfully', cart: createdCart })
  } catch (err) {
      return res.status(400).json({ error: err?.message || 'No Cart found' });
  }
}


exports.createOrUpdateCart = async (req, res) => {
  try {
      let cart = await Cart.findOne({ user: req.user.id })
      if (cart) {
          cart.products = req.body.products;
      } else {
          cart = new Cart(req.body)
      }
      const updatedCart = await cart.save()

      res.json({ message: 'Cart Updated Sucessfully', cart: updatedCart })
  } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err?.message || 'No Cart found' });
  }
}


exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('products.product')
    res.json(cart)
} catch (err) {
    return res.status(400).json({ error: err?.message || 'No Cart found' });
}
};

exports.removeFromCart = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  console.log("Delete by user: ", userId, productId)

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter((item) => !item.product.equals(productId));

    console.log("Deleting cart", cart.products);

    await cart.save();

    console.log("Deleted carts",cart)


    res.json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: error.message });
  }
};




exports.deleteAllCartItemsForUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = [];
    await cart.save();

    res.json({ success: true, message: 'All cart items deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart items:', error);
    res.status(500).json({ error: error.message });
  }
};


