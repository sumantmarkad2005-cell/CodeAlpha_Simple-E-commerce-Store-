import { fetchProductById } from './api.js';
import { formatPrice } from './utils.js';

const orderDetails = document.getElementById('order-details');

const displayOrder = async () => {
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
  if (!lastOrder || !lastOrder.items || lastOrder.items.length === 0) {
    orderDetails.innerHTML = '<p>You have no recent orders. <a href="index.html">Go shopping</a></p>';
    return;
  }

  let subtotal = 0;

  // ✅ Order meta section
  let html = `
    <div class="order-meta">
      <p><strong>Order ID:</strong> ${lastOrder.id}</p>
      <p><strong>Date:</strong> ${new Date(lastOrder.date).toLocaleString()}</p>
    </div>
    <h3>Items:</h3>
    <div class="order-items">
  `;

  for (const item of lastOrder.items) {
    const product = await fetchProductById(item._id);
    if (product) {
      subtotal += product.price * item.quantity;
      html += `
        <div class="order-item">
          <img src="${product.image}" alt="${product.name}">
          <div class="order-item-details">
            <h3>${product.name}</h3>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ${formatPrice(product.price)}</p>
          </div>
        </div>
      `;
    } else {
      html += `<p>Product with ID ${item._id} not found.</p>`;
    }
  }

  html += `
    </div>
    <h3>Order Total: ${formatPrice(subtotal)}</h3>
  `;

  orderDetails.innerHTML = html;
};

document.addEventListener('DOMContentLoaded', displayOrder);