require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/product');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const { category, sort, search, page = 1, limit = 10 } = req.query;
        let query = {};

        if (category && category !== 'all') query.category = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price-low') sortOption = { price: 1 };
        if (sort === 'price-high') sortOption = { price: -1 };
        if (sort === 'name') sortOption = { name: 1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const skip = (page - 1) * limit;
        const products = await Product.find(query).sort(sortOption).skip(skip).limit(parseInt(limit));
        const total = await Product.countDocuments(query);

        res.json({
            products,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/products/related/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const relatedProducts = await Product.find({
            _id: { $ne: product._id },
            category: product.category
        }).limit(4);

        res.json(relatedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
const userRoutes = require('./routes/userRoutes');

// User Routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));