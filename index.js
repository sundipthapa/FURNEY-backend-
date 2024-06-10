const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const cors = require('cors');
const userRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
// const billingAndShippingRoutes = require('./routes/billingAndShippingRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoriteRoutes = require('./routes/wishlistRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');
const esewaRoutes = require('./routes/paymentRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
const cloudinary = require('cloudinary').v2;
const multiparty = require('connect-multiparty');

dotenv.config(); // Load environment variables from .env file

const app = express();


app.use(multiparty());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS options
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS with specified options

//* Set EJS as the view engine
app.set('view engine', 'ejs');

//* Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/user', userRouter); // Use the router for /api/user routes
app.use('/api/product', productRouter); // Use the router for /api/product routes
app.use('/api/cart', cartRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/esewa', esewaRoutes);
// app.use('/api/billingandshipping', billingAndShippingRoutes);
// app.use('/api/payment', paymentRoutes);

// Server port
const PORT = process.env.PORT || 5000; // Default to port 5000 if PORT is not defined in .env

// Connect to the database and start the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database', err);
        process.exit(1); // Exit the process with an error code
    });

module.exports = app;
