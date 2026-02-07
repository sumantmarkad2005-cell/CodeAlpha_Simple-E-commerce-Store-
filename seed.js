require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');
const connectDB = require('./config/db');

const products = [
    {
        name: "Wireless Headphones",
        price: 99.99,
        description: "Noise-cancelling wireless headphones with 30h battery life",
        category: "electronics",
        image: "https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg",
        rating: 4.5,
        stock: 50
    },
    {
        name: "Smartphone X",
        price: 699.99,
        description: "Latest flagship smartphone with 128GB storage",
        category: "electronics",
        image: "https://cdn.pixabay.com/photo/2019/11/23/11/33/mobile-phone-4646854_1280.jpg",
        rating: 4.7,
        stock: 30
    },
    {
        name: "4K Smart TV",
        price: 899.99,
        description: "55-inch 4K UHD Smart TV with HDR",
        category: "electronics",
        image: "https://cdn.pixabay.com/photo/2015/02/07/20/58/tv-627876_1280.jpg",
        rating: 4.6,
        stock: 15
    },
    {
        name: "Laptop Pro",
        price: 1299.99,
        description: "16GB RAM, 512GB SSD, Intel Core i7",
        category: "electronics",
        image: "https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_1280.jpg",
        rating: 4.8,
        stock: 20
    },
    {
        name: "Denim Jeans",
        price: 49.99,
        description: "Classic fit denim jeans",
        category: "clothing",
        image: "https://cdn.pixabay.com/photo/2016/03/05/01/56/jeans-1237046_1280.jpg",
        rating: 4.3,
        stock: 75
    },
    {
        name: "Winter Jacket",
        price: 129.99,
        description: "Waterproof winter jacket with insulation",
        category: "clothing",
        image: "https://cdn.pixabay.com/photo/2023/03/16/15/00/woman-7856919_1280.jpg",
        rating: 4.5,
        stock: 25
    },
    {
        name: "Smart Thermostat",
        price: 199.99,
        description: "Learning thermostat with voice control",
        category: "home",
        image: "https://cdn.pixabay.com/photo/2017/07/04/13/55/tablet-2471184_1280.jpg",
        rating: 4.7,
        stock: 10
    },
    {
        name: "Yoga Mat",
        price: 29.99,
        description: "Eco-friendly non-slip yoga mat",
        category: "sports",
        image: "https://cdn.pixabay.com/photo/2017/05/31/08/35/kitchen-accessories-2359484_1280.jpg",
        rating: 4.5,
        stock: 50
    },
    {
        name: "Wireless Earbuds",
        price: 129.99,
        description: "True wireless earbuds with charging case",
        category: "electronics",
        image: "https://cdn.pixabay.com/photo/2022/10/31/14/26/earphones-7559937_1280.jpg",
        rating: 4.4,
        stock: 40
    },
    {
        name: "Gaming Mouse",
        price: 59.99,
        description: "RGB gaming mouse with 16000 DPI",
        category: "electronics",
        image: "https://cdn.pixabay.com/photo/2022/08/14/16/39/mouse-7386247_1280.jpg",
        rating: 4.3,
        stock: 35
    },
    {
        name: "Cotton T-Shirt",
        price: 24.99,
        description: "Comfortable 100% cotton t-shirt",
        category: "clothing",
        image: "https://cdn.pixabay.com/photo/2022/02/26/23/38/man-7036495_1280.jpg",
        rating: 4.2,
        stock: 100
    },
    {
        name: "Running Shoes",
        price: 89.99,
        description: "Lightweight running shoes with cushioning",
        category: "clothing",
        image: "https://cdn.pixabay.com/photo/2013/05/31/20/00/shoes-115102_1280.jpg",
        rating: 4.7,
        stock: 40
    },
    {
        name: "Coffee Maker",
        price: 49.99,
        description: "12-cup programmable coffee maker",
        category: "home",
        image: "https://cdn.pixabay.com/photo/2020/06/02/19/37/coffee-5252372_1280.jpg",
        rating: 4.6,
        stock: 30
    },
    {
        name: "Air Fryer",
        price: 89.99,
        description: "5.8L digital air fryer with 8 presets",
        category: "home",
        image: "https://cdn.pixabay.com/photo/2017/09/20/11/26/fryer-2768201_1280.jpg",
        rating: 4.4,
        stock: 20
    },
    {
        name: "Backpack",
        price: 39.99,
        description: "Water-resistant backpack with USB port",
        category: "accessories",
        image: "https://cdn.pixabay.com/photo/2019/07/15/10/57/backpack-4339090_1280.jpg",
        rating: 4.2,
        stock: 60
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        await Product.deleteMany({});
        console.log("Old products cleared");

        await Product.insertMany(products);
        console.log("Database seeded successfully!");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();