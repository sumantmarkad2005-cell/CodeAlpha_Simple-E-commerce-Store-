// product.js
import { formatPrice, showLoading, hideLoading } from './utils.js';
import { fetchProductById, fetchRelatedProducts, addToCart } from './api.js';

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const productContent = document.getElementById('product-content');
const relatedProductsContainer = document.getElementById('related-products');

// Detailed descriptions
const detailedDescriptions = {
  "Wireless Headphones": "Enjoy crystal-clear, immersive sound with these noise-cancelling headphones. With up to 30 hours of battery life, perfect for travel, work, or leisure.",
  "Smartphone X": "Experience cutting-edge technology with Smartphone X. Featuring a stunning display, fast processor, and 128GB storage for your essentials.",
  "4K Smart TV": "Upgrade your entertainment with this 55-inch 4K UHD Smart TV, offering breathtaking visuals, HDR support, and smart connectivity features.",
  "Laptop Pro": "Power through tasks with this high-performance laptop featuring Intel Core i7, 16GB RAM, and blazing-fast 512GB SSD storage.",
  "Denim Jeans": "Classic style meets comfort. These premium denim jeans offer a perfect fit for everyday wear and timeless fashion.",
  "Winter Jacket": "Stay warm and dry with this waterproof insulated winter jacket, designed to handle harsh weather in style.",
  "Smart Thermostat": "Automate your home’s climate with this intelligent thermostat. Enjoy energy savings, remote control, and voice assistant compatibility.",
  "Yoga Mat": "Enhance your workouts with this eco-friendly, non-slip yoga mat, ideal for yoga, stretching, and floor exercises.",
  "Wireless Earbuds": "True wireless freedom with rich sound, intuitive touch controls, and a portable charging case for all-day listening.",
  "Gaming Mouse": "Dominate your games with this RGB gaming mouse featuring 16000 DPI precision, customizable buttons, and ergonomic design.",
  "Cotton T-Shirt": "Stay cool and comfortable with this 100% cotton T-shirt. Soft, breathable, and perfect for everyday casual wear.",
  "Running Shoes": "Run with comfort and confidence. These lightweight, cushioned running shoes provide optimal support and performance.",
  "Coffee Maker": "Brew fresh coffee with ease using this 12-cup programmable coffee maker. Perfect for busy mornings or relaxing breaks.",
  "Air Fryer": "Crispy, healthy meals made simple. This 5.8L digital air fryer offers fast, oil-free cooking with 8 preset options.",
  "Backpack": "Carry your essentials with style. This water-resistant backpack features a USB charging port and organized compartments."
};

const displayProductDetails = (product) => {
  const description = detailedDescriptions[product.name] || product.description;

  productContent.innerHTML = `
    <div class="product-details-wrapper">
      <div class="product-images">
        <img src="${product.image}" alt="${product.name}" class="main-image">
        <div class="thumbnail-container">
          <img src="${product.image}" alt="Thumbnail" class="thumbnail active">
        </div>
      </div>
      <div class="product-details">
        <h1 class="product-title">${product.name}</h1>
        <div class="product-rating">
          ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
          <span>(${product.rating})</span>
        </div>
        <p class="product-price">${formatPrice(product.price)}</p>
        <p class="product-description">${description}</p>

        <div class="product-meta">
          <div class="meta-item">
            <span class="meta-label">Category:</span>
            <span>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Availability:</span>
            <span>${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>
        </div>

        <div class="product-actions">
          <div class="quantity-control">
            <button class="quantity-btn minus">-</button>
            <input type="number" class="quantity-input" value="1" min="1" max="${product.stock}">
            <button class="quantity-btn plus">+</button>
          </div>
          <button class="btn btn-primary btn-block" id="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

  // Quantity logic
  const minusBtn = document.querySelector('.quantity-btn.minus');
  const plusBtn = document.querySelector('.quantity-btn.plus');
  const quantityInput = document.querySelector('.quantity-input');
  const addToCartBtn = document.getElementById('add-to-cart-btn');

  minusBtn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value > 1) quantityInput.value = value - 1;
  });

  plusBtn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value < product.stock) quantityInput.value = value + 1;
  });

  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    addToCart(product._id, quantity);
  });
};

const displayRelatedProducts = (products) => {
  relatedProductsContainer.innerHTML = '';

  const filtered = products.filter(p => p._id !== productId);

  if (filtered.length === 0) {
    relatedProductsContainer.innerHTML = '<p>No related products found.</p>';
    return;
  }

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <a href="product.html?id=${product._id}" class="btn btn-secondary btn-block">View Details</a>
      </div>
    `;
    relatedProductsContainer.appendChild(div);
  });
};

const loadProductData = async () => {
  showLoading('loading-spinner'); // only works if you add a spinner in HTML; otherwise safe to remove

  try {
    if (!productId) {
      productContent.innerHTML = '<p>Product ID not specified.</p>';
      return;
    }

    const product = await fetchProductById(productId);

    if (!product) {
      productContent.innerHTML = '<p>Product not found.</p>';
      return;
    }

    displayProductDetails(product);

    const relatedProducts = await fetchRelatedProducts(productId, product.category);
    displayRelatedProducts(relatedProducts);
  } catch (error) {
    console.error('Error loading product:', error);
    productContent.innerHTML = '<p>Error loading product details. Please try again later.</p>';
  } finally {
    hideLoading('loading-spinner');
  }
};

document.addEventListener('DOMContentLoaded', loadProductData);