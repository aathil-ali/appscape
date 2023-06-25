const config = require("config");
const nodemailer = require("nodemailer");
const logger = require("./logger");

/**
 * @description Function to send an email
 * @param {import('nodemailer').SendMailOptions} mailOptions Addiitional email options
 */
const sendMail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.get("SMTP.HOST"),
      port: config.get("SMTP.PORT"),
      auth: {
        user: config.get("SMTP.AUTH_USERNAME"),
        pass: config.get("SMTP.AUTH_PASSWORD"),
      },
    });

    const emailInfo = await transporter.sendMail({
      from: config.get("SMTP.AUTH_USERNAME"),
      ...mailOptions,
    });

    logger.info("Message sent: %s", emailInfo.messageId);
  } catch (error) {
    logger.error("Error occurred while sending email", error);
    throw error;
  }
};

module.exports = { sendMail };
