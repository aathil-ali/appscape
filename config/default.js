const dotenv = require("dotenv");

dotenv.config();
console.log( process.env );
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE: {
    HOST: process.env.MYSQL_DATABASE_HOST,
    PORT: process.env.MYSQL_DATABASE_PORT,
    USERNAME: process.env.MYSQL_ROOT_USER,
    PASSWORD: process.env.MYSQL_PASSWORD,
    NAME: process.env.MYSQL_DATABASE
  },
  HUBSPOT: {
    BASE_URL: process.env.HUBSPOT_BASE_URL,
    ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN,
    CLIENT_ID:process.env.HUBSPOT_CLIENT_ID,
    CLIENT_SECRET:process.env.HUBSPOT_CLIENT_SECRET,
    REDIRECT_URI:process.env.HUBSPOT_REDIRECT_URI,
    OAUTH_API_ENDPOINT:process.env.HUBSPOT_OAUTH_API_ENDPOINT
  },
  SMTP: {
    HOST: process.env.SMTP_HOST,
    PORT: process.env.SMTP_PORT,
    AUTH_USERNAME: process.env.SMTP_AUTH_USERNAME,
    AUTH_PASSWORD: process.env.SMTP_AUTH_PASSWORD,
  }
};
