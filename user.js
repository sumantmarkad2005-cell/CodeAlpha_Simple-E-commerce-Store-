const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

const registerSection = document.getElementById('register-section');
const loginSection = document.getElementById('login-section');
const userContent = document.getElementById('user-content');

const API_URL = 'http://localhost:5000/api/users';

// === REGISTER ===
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value.trim();

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Registered successfully! Now log in.');
      registerForm.reset();
      registerSection.classList.remove('active');
      loginSection.classList.add('active');
    } else {
      alert(`❌ ${data.message || 'Registration failed'}`);
    }
  } catch (err) {
    console.error(err);
    alert('❌ Server error.');
  }
});

// === LOGIN ===
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`✅ Welcome, ${data.name}!`);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
      loginForm.reset();
      showLogout();
    } else {
      alert(`❌ ${data.message || 'Login failed'}`);
    }
  } catch (err) {
    console.error(err);
    alert('❌ Server error.');
  }
});

// === SHOW LOGOUT ===
function showLogout() {
  const user = JSON.parse(localStorage.getItem('user'));

  // Hide forms
  registerSection.classList.remove('active');
  loginSection.classList.remove('active');

  // Show user greeting + logout button
  userContent.innerHTML = `
    <p>👋 Hello, ${user?.name || 'User'}!</p>
    <button id="logout-btn">Logout</button>
  `;
  userContent.style.display = 'block';

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('lastOrder');

    // Optional: localStorage.clear();

    // Reset UI
    registerSection.classList.add('active');
    loginSection.classList.remove('active');
    userContent.innerHTML = '';
    userContent.style.display = 'none';
  });
}

// === Auto show logout if already logged in ===
if (localStorage.getItem('token')) {
  showLogout();
} else {
  userContent.style.display = 'none';
}