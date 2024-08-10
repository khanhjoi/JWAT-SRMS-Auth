import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// must be add this config() -> if not it can get .env in app. it will be get env system
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [`${__dirname}/../**/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
