import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }
  
  const config = parse(connectionString);
  
  // Проверяем и обрабатываем возможные null/undefined значения
  if (!config.host || !config.port || !config.user || !config.password || !config.database) {
    throw new Error('Invalid database connection configuration');
  }
  
  return {
    type: 'postgres',
    host: config.host,
    port: parseInt(config.port),
    username: config.user,
    password: config.password,
    database: config.database,
    ssl: { rejectUnauthorized: false },
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
  };
});
