const nodemailer = require("nodemailer");
const token = require("./token.json");
const client = require("./credentials.json");
const SENDER_EMAIL_ADDRESS = "kishore.ets@gmail.com";
const sendEmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL_ADDRESS,
        scope: "https://www.googleapis.com/auth/gmail.send",
        clientId: client.web.client_id,
        clientSecret: client.web.client_secret,
        refreshToken: token.refresh_token,
      },
    });

    await transporter.verify();

    if (data.file && data.file.name) {
      await transporter.sendMail({
        from: SENDER_EMAIL_ADDRESS,
        to: "info@eminencets.com",
        subject: "application recieved",
        text: `${data.name} with ${data.contact} having the skills ${data.skills}`,
        attachments: [
          {
            filename: data.file.name,
            path: data.file.path,
          },
        ],
      });
      await transporter.sendMail({
        from: SENDER_EMAIL_ADDRESS,
        to: data.email,
        subject: "Thank you for applying with ETS",
        text: `Dear ${data.name} thank you for applying through ETS. We will contact you shortly with opportunities.`,
      });
      return {
        status: 200,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error,
    };
  }
};
const contactEmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL_ADDRESS,
        scope: "https://www.googleapis.com/auth/gmail.send",
        clientId: client.web.client_id,
        clientSecret: client.web.client_secret,
        refreshToken: token.refresh_token,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: SENDER_EMAIL_ADDRESS,
      to: "info@eminencets.com",
      subject: data.subject,
      text: `${data.name} with ${data.phone} sent a message :  ${data.message}`,
    });
    await transporter.sendMail({
      from: SENDER_EMAIL_ADDRESS,
      to: data.email,
      subject: "Thank you for contacting ETS",
      text: `Dear ${data.name} thank you for contacting ETS. We will get back to you shortly.`,
    });
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error,
    };
  }
};

module.exports = { sendEmail, contactEmail };
