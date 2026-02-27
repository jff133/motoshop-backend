import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Настройка статических файлов
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // Получаем порт из переменных окружения
  const port = process.env.PORT || 3000;
  
  console.log(`Application starting on port ${port}...`);
  console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();			
