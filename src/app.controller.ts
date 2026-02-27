import { Controller, Get, Render, Req, Query } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  getIndex(@Req() request, @Query('demo') demo: string) {
    // Если передан параметр demo=auth, показываем авторизованного пользователя
    const user = demo === 'auth' ? { name: 'Демо Пользователь', email: 'demo@mail.com' } : null;
    
    return { 
      title: 'MotoShop - Главная',
      user: user
    };
  }

  @Get('catalog')
  @Render('catalog')
  getCatalog(@Req() request, @Query('demo') demo: string) {
    const user = demo === 'auth' ? { name: 'Демо Пользователь', email: 'demo@mail.com' } : null;
    
    return { 
      title: 'MotoShop - Каталог',
      user: user
    };
  }

  @Get('login')
  @Render('login')
  getLogin(@Req() request, @Query('demo') demo: string) {
    const user = demo === 'auth' ? { name: 'Демо Пользователь', email: 'demo@mail.com' } : null;
    
    return { 
      title: 'MotoShop - Вход',
      user: user
    };
  }

  @Get('register')
  @Render('register')
  getRegister(@Req() request, @Query('demo') demo: string) {
    const user = demo === 'auth' ? { name: 'Демо Пользователь', email: 'demo@mail.com' } : null;
    
    return { 
      title: 'MotoShop - Регистрация',
      user: user
    };
  }

  @Get('profile')
  @Render('profile')
  getProfile(@Req() request, @Query('demo') demo: string) {
    const user = demo === 'auth' ? { 
      name: 'Демо Пользователь', 
      email: 'demo@mail.com',
      phone: '+7 (999) 123-45-67'
    } : null;
    
    return { 
      title: 'MotoShop - Профиль',
      user: user
    };
  }
}
