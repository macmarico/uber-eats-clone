import {DataSource} from 'typeorm';

const connectionSecure = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  ssl: false,
  logging: true,
  entities: ['dist/src/app/domain/**/*.entity.js'],
  migrations: ['dist/src/storage/database/migrations/**/*.js'],
  subscribers: ['dist/src/storage/database/subscriber/**/*.js'],
  migrationsTransactionMode: 'each',
});

export default connectionSecure;
