import { DataSource } from 'typeorm';

const connectionSecure = new DataSource({
  type: 'postgres',
  url: 'postgres://api:development_pass@localhost:5434/auth-api',
  synchronize: false,
  ssl: false,
  logging: true,
  entities: ['dist/src/app/domain/**/*.entity.js'],
  migrations: ['dist/src/storage/database/migrations/**/*.js'],
  subscribers: ['dist/src/storage/database/subscriber/**/*.js'],
  migrationsTransactionMode: 'each',
});

export default connectionSecure;
