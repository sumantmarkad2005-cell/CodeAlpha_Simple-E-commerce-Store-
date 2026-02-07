import { fetchProductById } from './api.js';
import { formatPrice, showLoading, hideLoading, showToast, updateCartCount } from './utils.js';

const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

const shippingCost = 5.0;

// Load all cart data with full product info
const loadCartData = async () => {
  showLoading('loading-spinner');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <p class="empty-cart-message">Your cart is empty</p>
        <a href="index.html" class="btn">Continue Shopping</a>
      </div>
    `;
    subtotalElement.textContent = formatPrice(0);
    shippingElement.textContent = formatPrice(0);
    totalElement.textContent = formatPrice(0);
    updateCartCount();
    hideLoading('loading-spinner');
    return;
  }

  cartItemsContainer.innerHTML = '';

  let items = [];
  for (const item of cart) {
    const product = await fetchProductById(item._id);
    if (product) {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${product.name}</h3>
          <p class="cart-item-price">${formatPrice(product.price)}</p>

          <div class="quantity-control">
            <button class="quantity-btn minus" data-id="${product._id}">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${product.stock}" data-id="${product._id}">
            <button class="quantity-btn plus" data-id="${product._id}">+</button>
          </div>

          <div class="cart-item-actions">
            <span class="remove-item" data-id="${product._id}">
              <i class="fas fa-trash"></i> Remove
            </span>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(div);

      items.push({ ...product, quantity: item.quantity });
    }
  }

  attachCartEventListeners();
  updateCartSummary(items);
  hideLoading('loading-spinner');
};

// Update price summary
const updateCartSummary = (items) => {
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  subtotalElement.textContent = formatPrice(subtotal);
  shippingElement.textContent = formatPrice(shippingCost);
  totalElement.textContent = formatPrice(subtotal + shippingCost);

  updateCartCount();
};

// Handlers
const attachCartEventListeners = () => {
  document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
      let value = parseInt(input.value);
      if (value > 1) {
        value--;
        input.value = value;
        updateLocalQuantity(id, value);
        loadCartData();
      }
    });
  });

  document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
      let value = parseInt(input.value);
      const max = parseInt(input.getAttribute('max'));
      if (value < max) {
        value++;
        input.value = value;
        updateLocalQuantity(id, value);
        loadCartData();
      } else {
        showToast(`Maximum available quantity is ${max}`, 'warning');
      }
    });
  });

  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', () => {
      const id = input.getAttribute('data-id');
      let value = parseInt(input.value);
      const max = parseInt(input.getAttribute('max'));
      if (isNaN(value) || value < 1) value = 1;
      if (value > max) {
        value = max;
        showToast(`Maximum available quantity is ${max}`, 'warning');
      }
      input.value = value;
      updateLocalQuantity(id, value);
      loadCartData();
    });
  });

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      removeLocalItem(id);
      showToast('Item removed from cart', 'success');
      loadCartData();
    });
  });
};

// Local helpers
const updateLocalQuantity = (id, quantity) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(i => i._id === id);
  if (item) item.quantity = quantity;
  localStorage.setItem('cart', JSON.stringify(cart));
};

const removeLocalItem = (id) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(i => i._id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Checkout
checkoutBtn.addEventListener('click', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    showToast('Your cart is empty', 'warning');
  } else {
    window.location.href = 'checkout.html';
  }
});

// Start
document.addEventListener('DOMContentLoaded', loadCartData);