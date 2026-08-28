import nodemailer from "nodemailer";

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"ChatApp Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Could not send verification email.");
  }
};

export default sendEmail;