export default () => ({
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires: process.env.JWT_EXPIRES || '60s',
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
});
