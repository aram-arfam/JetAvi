import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,

  auth: {
    user: '856a41002@smtp-brevo.com',
    pass: '0ya3kb1M7XULd6CP',
  },
});

export default transporter;
 