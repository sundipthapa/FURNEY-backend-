const Favorite = require('../model/wishlistModel');

// Add product to favorites
exports.addToFavorites = async (req, res) => {
  const { user, products } = req.body;

  try {
    // Find the favorite record for the user
    let favorite = await Favorite.findOne({ user });

    if (!favorite) {
      // If favorites document doesn't exist, create a new one
      favorite = new Favorite({
        user,
        products: [...products], // Copy products array
      });
    } else {
      // Update the existing favorites document
      products.forEach(product => {
        if (!favorite.products.some(p => p.product.equals(product.product))) {
          favorite.products.push(product);
        }
      });
    }

    await favorite.save();

    res.json({
      success: true,
      message: "Added to favorites successfully",
      favorite,
    });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "Error adding to favorites" });
  }
};

// Get user's favorite products
exports.getFavorites = async (req, res) => {
    try {
      const  userId  = req.user.id;

      console.log("Get favorite : " , userId);

      const favorites = await Favorite.find({ user: userId }).populate({
        path:'products.product',
        select: 'title description price images'
      });

      console.log(favorites)
      
      res.status(200).json({ success: true, favorites });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };



// Remove product from favorites
exports.removeSingleFavoriteById = async (req, res) => {
  try {

    console.log(req.params);

    const { userId, productId } = req.params;
    await Favorite.updateOne(
      { user: userId },
      { $pull: { products: { product: productId } } }
    );
    res.status(200).json({ success: true, message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete all favorite items for a user
exports.deleteAllFavoritesById = async (req, res) => {
    try {
      const { userId } = req.params;
  
      await Favorite.updateOne(
        { user: userId },
        { $set: { products: [] } } // Set products array to empty
      );
  
      res.status(200).json({ success: true, message: 'All favorites deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
