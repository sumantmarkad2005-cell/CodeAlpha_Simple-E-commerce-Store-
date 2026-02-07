import { formatPrice, showLoading, hideLoading, updateCartCount } from './utils.js';
import { fetchProducts, addToCart } from './api.js';

const productList = document.getElementById('product-list');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const loadMoreBtn = document.getElementById('load-more');

let currentPage = 1;
const productsPerPage = 6;
let isLoading = false;

const displayProducts = (products) => {
    if (products.length === 0) {
        productList.innerHTML = '<p class="no-products">No products found.</p>';
        loadMoreBtn.style.display = 'none';
        return;
    }
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))} <span>(${p.rating})</span>
                </div>
                <p class="product-price">${formatPrice(p.price)}</p>
                <p class="product-description">${p.description.slice(0, 100)}...</p>
                <div class="product-actions">
                    <a href="product.html?id=${p._id}" class="btn">View Details</a>
                    <button class="btn btn-secondary add-to-cart-btn" data-id="${p._id}">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(div);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            addToCart(id, 1);
            updateCartCount();
        });
    });
};

const loadProducts = async (page = 1, append = false) => {
    if (isLoading) return;
    isLoading = true;
    showLoading('loading-spinner');
    try {
        const category = categoryFilter.value;
        const sort = sortBy.value !== 'default' ? sortBy.value : null;
        const products = await fetchProducts({ category, sort, page, limit: productsPerPage });
        if (!append) productList.innerHTML = '', currentPage = 1;
        displayProducts(products);
        loadMoreBtn.style.display = products.length === productsPerPage ? 'block' : 'none';
    } catch {
        productList.innerHTML = '<p class="error-message">Failed to load products.</p>';
    } finally {
        isLoading = false;
        hideLoading('loading-spinner');
    }
};

categoryFilter.addEventListener('change', () => loadProducts());
sortBy.addEventListener('change', () => loadProducts());
loadMoreBtn.addEventListener('click', () => loadProducts(++currentPage, true));

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
});