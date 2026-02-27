const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log('Запрос:', req.url);
    
    // Получаем путь без параметров
    let urlPath = req.url.split('?')[0];
    
    // Определяем файл для отдачи
    let filePath;
    
    if (urlPath === '/') {
        filePath = './index.html';
    } else if (urlPath === '/catalog.html' || urlPath === '/catalog') {
        filePath = './catalog.html';
    } else if (urlPath === '/profile.html' || urlPath === '/profile') {
        filePath = './profile.html';
    } else if (urlPath === '/login.html' || urlPath === '/login') {
        filePath = './login.html';
    } else if (urlPath === '/register.html' || urlPath === '/register') {
        filePath = './register.html';
    } else {
        // Для статических файлов (css, js, images)
        filePath = '.' + urlPath;
    }
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                console.log('Файл не найден:', filePath);
                // Пробуем найти index.html в папке
                if (urlPath.endsWith('/')) {
                    fs.readFile('./index.html', (err, content) => {
                        if (err) {
                            res.writeHead(404);
                            res.end('404 Not Found');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(content, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(404);
                    res.end('404 Not Found - Файл не найден: ' + filePath);
                }
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 Сервер MotoShop запущен!');
    console.log('=================================');
    console.log('📍 Главная: http://localhost:3000/');
    console.log('📍 Каталог: http://localhost:3000/catalog.html');
    console.log('📍 Профиль: http://localhost:3000/profile.html');
    console.log('📍 Вход: http://localhost:3000/login.html');
    console.log('=================================');
    console.log('Нажмите Ctrl+C для остановки');
    console.log('=================================');
});
