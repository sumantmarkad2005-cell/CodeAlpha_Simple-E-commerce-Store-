import { formatPrice, updateCartCount, showToast } from './utils.js';

const productList = document.getElementById('product-list');

const loadProducts = async () => {
    try {
        const res = await fetch('/api/products');  // Adjust if your API route is different
        const products = await res.json();
        displayProducts(products);
    } catch (err) {
        console.error('Error loading products:', err);
        productList.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
};

const displayProducts = (products) => {
    productList.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}</p>
            <p class="desc">${product.description}</p>
            <button class="add-to-cart-btn" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
        `;
        productList.appendChild(div);
    });

    attachAddToCart();
};

const attachAddToCart = () => {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = {
                _id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image,
                quantity: 1
            };
            addToCart(product);
        });
    });
};

const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const exists = cart.find(item => item._id === product._id);
    if (exists) {
        cart = cart.map(item => {
            if (item._id === product._id) item.quantity += 1;
            return item;
        });
        showToast('Increased quantity', 'info');
    } else {
        cart.push(product);
        showToast('Added to cart', 'success');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
};

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
});