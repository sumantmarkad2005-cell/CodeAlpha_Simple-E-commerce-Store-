import { fetchProductById } from './api.js';
import { formatPrice, showToast } from './utils.js';

const checkoutItemsContainer = document.getElementById('checkout-items');
const subtotalElement = document.getElementById('checkout-subtotal');
const shippingElement = document.getElementById('checkout-shipping');
const totalElement = document.getElementById('checkout-total');
const placeOrderBtn = document.getElementById('place-order-btn');

// Calculate totals
const calculateTotals = (items) => {
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  const shipping = items.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  subtotalElement.textContent = formatPrice(subtotal);
  shippingElement.textContent = formatPrice(shipping);
  totalElement.textContent = formatPrice(total);
};

// Render checkout items
const displayCheckoutItems = async () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML = '<p>Your cart is empty. <a href="index.html">Go shopping</a></p>';
    calculateTotals([]);
    return;
  }

  checkoutItemsContainer.innerHTML = '';
  let items = [];

  for (const item of cart) {
    const product = await fetchProductById(item._id);
    if (product) {
      const div = document.createElement('div');
      div.className = 'checkout-item';
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="checkout-item-img">
        <div class="checkout-item-details">
          <h3>${product.name}</h3>
          <p>Price: ${formatPrice(product.price)}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Subtotal: ${formatPrice(product.price * item.quantity)}</p>
        </div>
      `;
      checkoutItemsContainer.appendChild(div);
      items.push({
        ...product,
        quantity: item.quantity
      });
    }
  }

  calculateTotals(items);
};

// Place order → save to localStorage → clear cart
placeOrderBtn.addEventListener('click', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    showToast('Your cart is empty', 'warning');
    return;
  }

  const order = {
    id: Date.now(),
    items: cart,
    date: new Date().toISOString(),
  };

  localStorage.setItem('lastOrder', JSON.stringify(order));
  localStorage.removeItem('cart');

  showToast('Order placed successfully!', 'success');
  setTimeout(() => {
    window.location.href = 'orders.html';
  }, 1500);
});

document.addEventListener('DOMContentLoaded', displayCheckoutItems);