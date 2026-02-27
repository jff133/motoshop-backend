// Состояние профиля
let profileState = {
    orders: [],
    loading: false
};

// Инициализация страницы профиля
document.addEventListener('DOMContentLoaded', () => {
    console.log('Profile page loaded');
    console.log('Auth state:', state.isAuthenticated, state.user);
    
    // Проверяем авторизацию
    if (!state.isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    loadProfileData();
    setupProfileListeners();
});

// Загрузка данных профиля
async function loadProfileData() {
    profileState.loading = true;
    
    // Отображаем данные пользователя
    displayUserInfo();
    
    // Загружаем демо-заказы
    loadDemoOrders();
}

// Загрузка демо-заказов
function loadDemoOrders() {
    profileState.orders = [
        {
            id: 1,
            date: '2024-02-15',
            status: 'completed',
            items: [
                { name: 'Yamaha R1', quantity: 1, price: 1500000 }
            ],
            total: 1500000
        },
        {
            id: 2,
            date: '2024-02-20',
            status: 'processing',
            items: [
                { name: 'Тормозные колодки', quantity: 2, price: 3500 },
                { name: 'Масляный фильтр', quantity: 1, price: 800 }
            ],
            total: 7800
        },
        {
            id: 3,
            date: '2024-02-25',
            status: 'completed',
            items: [
                { name: 'Глушитель Akrapovic', quantity: 1, price: 45000 }
            ],
            total: 45000
        }
    ];
    
    displayOrders();
}

// Отображение информации о пользователе
function displayUserInfo() {
    console.log('Displaying user info:', state.user);
    
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    
    if (userName && state.user) {
        userName.textContent = state.user.name || 'Пользователь';
    }
    
    if (userEmail && state.user) {
        userEmail.textContent = state.user.email || '';
    }
    
    if (nameInput && state.user) {
        nameInput.value = state.user.name || '';
    }
    
    if (phoneInput && state.user) {
        phoneInput.value = state.user.phone || '+7 (999) 123-45-67';
    }
}

// Настройка слушателей событий
function setupProfileListeners() {
    // Переключение вкладок
    const profileTabs = document.querySelectorAll('.profile-tab');
    profileTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            profileTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const tabName = e.target.dataset.tab;
            switchProfileTab(tabName);
        });
    });
    
    // Форма профиля
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
}

// Переключение вкладок профиля
function switchProfileTab(tabName) {
    const ordersTab = document.getElementById('ordersTab');
    const settingsTab = document.getElementById('settingsTab');
    
    if (ordersTab && settingsTab) {
        ordersTab.classList.remove('active');
        settingsTab.classList.remove('active');
        
        if (tabName === 'orders') {
            ordersTab.classList.add('active');
        } else if (tabName === 'settings') {
            settingsTab.classList.add('active');
        }
    }
}

// Отображение заказов
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (profileState.orders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders">У вас пока нет заказов</div>';
        return;
    }
    
    ordersList.innerHTML = profileState.orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span>Заказ №${order.id}</span>
                <span class="order-status ${order.status}">
                    ${order.status === 'completed' ? 'Выполнен' : 'В обработке'}
                </span>
            </div>
            <div class="order-date">Дата: ${new Date(order.date).toLocaleDateString('ru-RU')}</div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div>${item.name} x${item.quantity} - ${formatPrice(item.price)} ₽</div>
                `).join('')}
            </div>
            <div class="order-total">
                Итого: ${formatPrice(order.total)} ₽
            </div>
        </div>
    `).join('');
}

// Обработка обновления профиля
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    
    // Демо-режим
    if (state.user) {
        state.user.name = name;
        state.user.phone = phone;
        localStorage.setItem('user', JSON.stringify(state.user));
        displayUserInfo();
        showNotification('Профиль обновлен');
    }
}
