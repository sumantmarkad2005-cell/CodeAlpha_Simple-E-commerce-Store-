// ✅ Format a number as USD currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// ✅ Update cart count on all elements with .cart-count class
export const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = cart.length;
  });
};

// ✅ Show a loading spinner by ID
export const showLoading = (id) => {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
};

// ✅ Hide a loading spinner by ID
export const hideLoading = (id) => {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
};

// ✅ Show a toast notification
export const showToast = (msg, type = 'success') => {
  // Remove any existing toasts first (optional)
  document.querySelectorAll('.toast').forEach(el => el.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 50);

  // Animate out and remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ✅ Update cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);