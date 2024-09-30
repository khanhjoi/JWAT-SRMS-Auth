import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// must be add this config() -> if not it can get .env in app. it will be get env system
config();

export const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../**/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
};

export const dataSource = new DataSource(options);
