require("dotenv").config();
import { env } from 'process';

module.exports = {
    "server_url": env.SERVER_URL,
    "server_port": process.env.SERVER_PORT,
    "username": process.env.MYSQL_ROOT_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_DATABASE_HOST,
    "port": process.env.MYSQL_DATABASE_PORT,
    "pool_size": process.env.MYSQL_POOL_SIZE,
    "dialect": "mysql",
};
