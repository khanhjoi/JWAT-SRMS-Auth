export default () => ({
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires: process.env.JWT_EXPIRES || '10m',
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
  },
});

export type databaseConfigType = {
  type: string | any;
  host: string;
  port: number;
  username: string;
  password: string;
  dbName: string;
};
