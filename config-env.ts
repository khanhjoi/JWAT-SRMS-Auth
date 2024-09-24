export default () => ({
  super_Admin_Id: process.env.SUPER_ADMIN_ID,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires: process.env.JWT_EXPIRES || '10m',
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    dbSchema: process.env.DB_SCHEMA,
  },
  services: [
    {
      notification_kafka: process.env.NOTIFICATION_KAFKA_CLIENT_ID,
      notification_broker: process.env.NOTIFICATION_KAFKA_BROKER,
      notification_group_id: process.env.NOTIFICATION_KAFKA_GROUP_ID,
    },
  ],
});

export type databaseConfigType = {
  type: string | any;
  host: string;
  port: number;
  username: string;
  password: string;
  dbName: string;
  dbSchema: string;
};
