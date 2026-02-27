// Инициализация страницы авторизации
document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth page loaded');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Если пользователь уже авторизован, перенаправляем на профиль
    if (state.isAuthenticated) {
        console.log('Already authenticated, redirecting to profile');
        window.location.href = 'profile.html';
    }
});

// Обработка входа
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt:', email);
    
    // Простая валидация
    if (!email || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    // Демо-вход
    if (email === 'demo@mail.com' && password === '123456') {
        const user = {
            id: 1,
            name: 'Демо Пользователь',
            email: 'demo@mail.com',
            phone: '+7 (999) 123-45-67'
        };
        
        localStorage.setItem('token', 'demo-token-123');
        localStorage.setItem('user', JSON.stringify(user));
        
        // Обновляем состояние
        state.isAuthenticated = true;
        state.user = user;
        
        console.log('Login successful, user:', user);
        showNotification('Успешный вход!');
        
        // Перенаправляем на профиль
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    } else {
        showNotification('Неверный email или пароль (используйте demo@mail.com / 123456)', 'error');
    }
}

// Обработка регистрации
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    console.log('Register attempt:', email);
    
    // Валидация
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен быть не менее 6 символов', 'error');
        return;
    }
    
    // Демо-регистрация
    showNotification('Демо-режим: регистрация успешна! Теперь вы можете войти.');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}
