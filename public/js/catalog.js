// Состояние каталога
let catalogState = {
    motorcycles: [],
    parts: [],
    currentType: 'all',
    loading: false
};

// Загрузка при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
    loadCatalogData();
    setupCatalogListeners();
    checkUrlParams();
});

// Загрузка данных каталога
async function loadCatalogData() {
    catalogState.loading = true;
    showLoading();
    
    try {
        // Загружаем мотоциклы
        const motorcyclesRes = await fetch(API.motorcycles);
        const motorcycles = await motorcyclesRes.json();
        
        // Загружаем запчасти
        const partsRes = await fetch(API.parts);
        const parts = await partsRes.json();
        
        catalogState.motorcycles = motorcycles.map(m => ({
            ...m,
            type: 'motorcycle',
            categoryName: getCategoryName(m.category, 'motorcycle')
        }));
        
        catalogState.parts = parts.map(p => ({
            ...p,
            type: 'part',
            categoryName: getCategoryName(p.category, 'part')
        }));
        
        renderCatalog();
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
        loadDemoCatalogData();
    } finally {
        catalogState.loading = false;
        hideLoading();
    }
}

// Демо-данные для каталога (БЕЗ пометок "Мотоцикл")
function loadDemoCatalogData() {
    catalogState.motorcycles = [
        {
            id: 1,
            name: 'Yamaha R1',
            category: 'sport',
            categoryName: 'Спортивный',
            price: 1500000,
            description: 'Спортивный мотоцикл с мощным двигателем',
            image: '/images/Yamaha_R1.png',
            inStock: true,
            type: 'motorcycle'
        },
        {
            id: 2,
            name: 'Harley Davidson Sportster',
            category: 'cruiser',
            categoryName: 'Круизер',
            price: 1200000,
            description: 'Классический американский круизер',
            image: '/images/harley_davidson_sportster_cruiser.png',
            inStock: true,
            type: 'motorcycle'
        },
        {
            id: 3,
            name: 'KTM 450 EXC',
            category: 'offroad',
            categoryName: 'Внедорожный',
            price: 800000,
            description: 'Эндуро для бездорожья',
            image: '/images/KTM_450_EXC.png',
            inStock: true,
            type: 'motorcycle'
        },
        {
            id: 4,
            name: 'Suzuki Hayabusa',
            category: 'sport',
            categoryName: 'Спортивный',
            price: 1800000,
            description: 'Легендарный спорт-турер',
            image: "/images/suzuki.png",
            inStock: false,
            type: 'motorcycle'
        }
    ];
    
    catalogState.parts = [
        {
            id: 101,
            name: 'Тормозные колодки',
            category: 'brakes',
            categoryName: 'Тормозная система',
            price: 3500,
            description: 'Передние тормозные колодки',
            image: '/images/stop_system.png',
            inStock: true,
            type: 'part'
        },
        {
            id: 102,
            name: 'Масляный фильтр',
            category: 'engine',
            categoryName: 'Двигатель',
            price: 800,
            description: 'Оригинальный масляный фильтр',
            image: '/images/oil_filter.png',
            inStock: true,
            type: 'part'
        },
        {
            id: 103,
            name: 'Глушитель Akrapovic',
            category: 'exhaust',
            categoryName: 'Выхлопная система',
            price: 45000,
            description: 'Спортивный глушитель',
            image: '/images/akrapovic.png',
            inStock: true,
            type: 'part'
        },
        {
            id: 104,
            name: 'Тормозные диски',
            category: 'brakes',
            categoryName: 'Тормозная система',
            price: 8500,
            description: 'Передние тормозные диски',
            image: 'images/stop_disk.png',
            inStock: true,
            type: 'part'
        }
    ];
    
    renderCatalog();
}

// Настройка слушателей событий
function setupCatalogListeners() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            catalogState.currentType = e.target.dataset.type;
            renderCatalog();
        });
    });
}

// Проверка параметров URL
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const category = urlParams.get('category');
    
    if (type) {
        const tab = document.querySelector(`.filter-tab[data-type="${type}"]`);
        if (tab) {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            catalogState.currentType = type;
        }
    }
    
    if (category) {
        // Если указана категория, показываем соответствующий тип
        if (category === 'sport' || category === 'cruiser' || category === 'offroad') {
            const tab = document.querySelector('.filter-tab[data-type="motorcycles"]');
            if (tab) {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                catalogState.currentType = 'motorcycles';
            }
        }
    }
}

// Рендеринг каталога (УБРАНА пометка "Мотоцикл")
function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    
    let items = [];
    
    if (catalogState.currentType === 'all') {
        items = [...catalogState.motorcycles, ...catalogState.parts];
    } else if (catalogState.currentType === 'motorcycles') {
        items = catalogState.motorcycles;
    } else if (catalogState.currentType === 'parts') {
        items = catalogState.parts;
    }
    
    // Сортировка по цене
    items.sort((a, b) => a.price - b.price);
    
    if (items.length === 0) {
        grid.innerHTML = '<div class="no-products">Товары не найдены</div>';
        return;
    }
    
    grid.innerHTML = items.map(item => `
        <div class="product-card" data-id="${item.id}" data-type="${item.type}">
            <div class="product-image">
                <img src="${item.image}" alt="${item.name}">
                ${!item.inStock ? '<span class="product-badge">Нет в наличии</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${item.name}</h3>
                <p class="product-category">${item.categoryName}</p>
                <p class="product-description">${item.description.substring(0, 60)}${item.description.length > 60 ? '...' : ''}</p>
                <p class="product-price">${formatPrice(item.price)} ₽</p>
                <button class="add-to-cart" onclick="handleAddToCart(${item.id}, '${item.type}')"
                    ${!item.inStock ? 'disabled' : ''}>
                    ${item.inStock ? 'В корзину' : 'Нет в наличии'}
                </button>
            </div>
        </div>
    `).join('');
}

// Обработка добавления в корзину
function handleAddToCart(productId, type) {
    let product;
    
    if (type === 'motorcycle') {
        product = catalogState.motorcycles.find(m => m.id === productId);
    } else {
        product = catalogState.parts.find(p => p.id === productId);
    }
    
    if (product) {
        addToCart(product);
    }
}

// Показать загрузку
function showLoading() {
    const grid = document.getElementById('catalogGrid');
    if (grid) {
        grid.innerHTML = '<div class="no-products">Загрузка...</div>';
    }
}

// Скрыть загрузку
function hideLoading() {
    // Ничего не делаем, рендер сам обновится
}

// Получение названия категории
function getCategoryName(category, type) {
    const motorcycleCategories = {
        sport: 'Спортивный',
        cruiser: 'Круизер',
        offroad: 'Внедорожный',
        touring: 'Туристический',
        naked: 'Нейкед'
    };
    
    const partCategories = {
        engine: 'Двигатель',
        brakes: 'Тормозная система',
        exhaust: 'Выхлопная система',
        suspension: 'Подвеска',
        electronics: 'Электроника',
        body: 'Кузовные детали'
    };
    
    if (type === 'motorcycle') {
        return motorcycleCategories[category] || category;
    } else {
        return partCategories[category] || category;
    }
}

// Делаем функцию глобально доступной
window.handleAddToCart = handleAddToCart;
