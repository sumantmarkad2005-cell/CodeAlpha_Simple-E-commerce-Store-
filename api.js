// ✔️ Base URL — fine for local dev
const API_BASE_URL = 'http://localhost:5000/api';

// ✔️ Fetch all products with filters
export const fetchProducts = async (options = {}) => {
  const { category, sort, page = 1, limit = 6 } = options;
  const url = new URL(`${API_BASE_URL}/products`);

  if (category && category !== 'all') url.searchParams.append('category', category);
  if (sort) url.searchParams.append('sort', sort);
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return data.products;
};

// ✔️ Fetch single product by ID
export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Product not found');
  return await response.json();
};

// ✔️ Fetch related products
export const fetchRelatedProducts = async (currentId, category) => {
  const response = await fetch(`${API_BASE_URL}/products/related/${currentId}`);
  if (!response.ok) return [];
  return await response.json();
};

// ✔️ Add to cart: uses localStorage
export const addToCart = (productId, quantity = 1) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item._id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ _id: productId, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Product added to cart!');
};