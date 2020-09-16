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

    await transporter.sendMail({
      from: SENDER_EMAIL_ADDRESS,
      to: data.email,
      subject: "application recieved",
      text: `${data.name} with ${data.contact} having the skills ${data.skills}`,
      attachments: [
        {
          filename: data.file.name,
          path: data.file.path,
        },
      ],
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

module.exports = { sendEmail };
