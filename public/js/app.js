// API endpoints
const API = {
    motorcycles: 'http://localhost:3000/api/motorcycles',
    parts: 'http://localhost:3000/api/parts',
    cart: 'http://localhost:3000/api/cart',
    orders: 'http://localhost:3000/api/orders',
    auth: 'http://localhost:3000/api/auth',
    profile: 'http://localhost:3000/api/profile'
};

// Состояние приложения
let state = {
    cart: [],
    user: null,
    isAuthenticated: false
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('App.js загружен');
    
    // Загружаем данные
    loadCartFromStorage();
    checkAuthStatus();
    
    // Инициализируем обработчики
    initEventListeners();
    
    // Обновляем UI
    updateCartUI();
    updateAuthUI();
});

// Инициализация обработчиков
function initEventListeners() {
    // КОРЗИНА
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    // Кнопка закрытия корзины
    const closeBtn = document.getElementById('closeCart');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeCart();
        });
    }
    
    // Оверлей
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeCart();
        });
    }
    
    // Мобильное меню
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
}

// Функции корзины
function openCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar) {
        sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar) {
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Загрузка корзины
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            state.cart = JSON.parse(savedCart);
        } catch (e) {
            state.cart = [];
        }
    }
}

// Сохранение корзины
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

// Добавление в корзину
function addToCart(product) {
    if (!product) return;
    
    const existingItem = state.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            type: product.type
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    showNotification('Товар добавлен в корзину');
}

// Обновление UI корзины
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    if (cartItems) {
        if (state.cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        } else {
            cartItems.innerHTML = state.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)} ₽</div>
                        <div class="cart-item-actions">
                            <button onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) {
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = formatPrice(total) + ' ₽';
    }
}

// Обновление количества
function updateQuantity(productId, delta) {
    const itemIndex = state.cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;
    
    const item = state.cart[itemIndex];
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        updateCartUI();
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
    showNotification('Товар удален из корзины');
}

// Оформление заказа
function checkout() {
    if (state.cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    if (!state.isAuthenticated) {
        showNotification('Необходимо войти в систему', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    showNotification('Заказ оформлен! (демо-режим)');
    state.cart = [];
    saveCartToStorage();
    updateCartUI();
    closeCart();
}

// Мобильное меню
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Авторизация
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
        try {
            state.isAuthenticated = true;
            state.user = JSON.parse(userData);
        } catch (e) {
            state.isAuthenticated = false;
            state.user = null;
        }
    } else {
        state.isAuthenticated = false;
        state.user = null;
    }
}

function updateAuthUI() {
    const loginLinks = document.querySelectorAll('.login-link');
    const logoutLinks = document.querySelectorAll('#logoutLink');
    
    if (state.isAuthenticated) {
        loginLinks.forEach(link => {
            if (link) link.style.display = 'none';
        });
        logoutLinks.forEach(link => {
            if (link) {
                link.style.display = 'block';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        });
    } else {
        loginLinks.forEach(link => {
            if (link) link.style.display = 'block';
        });
        logoutLinks.forEach(link => {
            if (link) link.style.display = 'none';
        });
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    state.isAuthenticated = false;
    state.user = null;
    updateAuthUI();
    showNotification('Вы вышли из системы');
    
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login.html' && currentPage !== 'index.html') {
        window.location.href = 'index.html';
    }
}

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

// Уведомления
function showNotification(message, type = 'success') {
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Глобальные функции
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.openCart = openCart;
window.closeCart = closeCart;
