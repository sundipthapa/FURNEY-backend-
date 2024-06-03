const Product = require('../model/productModel');
const cloudinary = require('cloudinary').v2;



const createProduct = async (req, res) => {
  // Step 1: Check incoming data
  // console.log(req.body);
  // console.log(req.files);

  // Step 2: Destructuring data
  const {
    ownerId,
    title,
    description,
    category,
    condition,
    price,
    email,
    phoneno,
    address
  } = req.body;
  const { images } = req.files;

  // console.log("Admin check:  " , req.user.isAdmin);

  const isAdmin = req.user.isAdmin;

  console.log(isAdmin)//output: true if it is admin else false

  // Log fields for debugging
  // console.log('ownerId:', ownerId);
  // console.log('title:', title);
  // console.log('description:', description);
  // console.log('category:', category);
  // console.log('condition:', condition);
  // console.log('price:', price);
  // console.log('email:', email);
  // console.log('phone:', phoneno);
  // console.log('address:', address);
  // console.log('images:', images);

  // Step 3: Validate data
  if (
    !ownerId ||
    !title ||
    !description ||
    !category ||
    !price ||
    !images ||
    images.length !== 3 ||
    (!isAdmin && (!email || !phoneno || !address || !condition))
  ) {
    return res.json({
      success: false,
      message: "Please fill all the fields and upload exactly 3 images"
    });
  }

  try {
    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(image =>
        cloudinary.uploader.upload(image.path, {
          folder: "postproducts",
          crop: "scale"
        })
      )
    );

    const imageUrls = uploadedImages.map(image => image.secure_url);

    // Save to database
    const newProduct = new Product({
      ownerId: ownerId,
      title: title,
      description: description,
      category: category,
      condition: condition,
      price: parseFloat(price),
      email: email,
      phoneno: phoneno,
      address: address,
      images: imageUrls
    });
    await newProduct.save();
    res.json({
      success: true,
      message: "Product post successfully",
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get All Products
const getProducts = async (req, res) => {
  try {
    const userId = req.params.ownerId; // assuming req.user contains the logged-in user's information


    // console.log("ID  "+userId)
    // Fetch Products excluding the ones uploaded by the logged-in user
    const products = await Product.find({ ownerId: { $ne: userId } });

    res.json({
      success: true,
      message: 'Products fetched successfully',
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
// Get All Products
const getProductsAdmin = async (req, res) => {
  try {
    // console.log("ID  "+ req.user.isAdmin)
    // Fetch Products excluding the ones uploaded by the logged-in user
    const products = await Product.find({});

    res.json({
      success: true,
      message: 'Products fetched successfully',
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Specific product
const getProduct = async (req, res) => {
  console.log(req.params.productId)
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({
      success: true,
      message: 'Products fetched successfully',
      product: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getProductsByCategory = async (req, res) => {
  const category = req.params.category;

  console.log(category)
  try {
    const products = await Product.find({ category: category });
    res.json({
      success: true,
      message: `Products in category "${category}" fetched successfully!`,
      products: products
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}


const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    console.log("Categories fetched successfully:", categories);

    res.json({
      success: true,
      message: 'Categories fetched successfully',
      categories: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


const searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // Correctly extract query parameter
    console.log("Queries:", req.query);

    // Perform a case-insensitive search for products containing the query in their title or description
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch Trending Products
const getTrendingProducts = async (req, res) => {
  try {
    const trendingProducts = await Product.find({ isTrending: true });
    res.json({
      success: true,
      message: 'Trending products fetched successfully',
      products: trendingProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Fetch Featured Products
const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    res.json({
      success: true,
      message: 'Featured products fetched successfully',
      products: featuredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createProduct, getProducts,
  getProductsAdmin, getProduct,
  getProductsByCategory, getAllCategories,
  searchProducts, getFeaturedProducts, getTrendingProducts
};





