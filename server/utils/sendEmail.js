import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    // ✅ Create transporter INSIDE function
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // ✅ Force IPv4 to fix Render deployment issue
    });

    await transporter.sendMail({
      from: `"Mess Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      text: `
Hello,

Your OTP is: ${otp}

Valid for 5 minutes.
`,
      html: `
        <h2>OTP Verification</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });
    console.log("OTP email sent to:", email);
  } catch (err) {
    console.log("Email sending error:", err);
    throw err;
  }
};

export const sendApprovalEmail = async (email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // ✅ Force IPv4 to fix Render deployment issue
    });

    await transporter.sendMail({
      from: `"Mess Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Approved",
      text: message,
    });
    console.log("Approval email sent to:", email);
  } catch (err) {
    console.log("EMAIL ERROR:", err);
  }
};

export const sendRejectionEmail = async (email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // ✅ Force IPv4 to fix Render deployment issue
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Rejected ❌",
      text: message,
    });
    console.log("Rejection email sent to:", email);
  } catch (err) {
    console.log("REJECTION EMAIL ERROR:", err);
  }
};

export const sendPendingEmail = async (email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // ✅ Force IPv4 to fix Render deployment issue
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Pending Approval ⏳",
      text: message,
    });
    console.log("Pending email sent to:", email);
  } catch (err) {
    console.log("PENDING EMAIL ERROR:", err);
  }
};

export const sendDeleteEmail = async (email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // ✅ Force IPv4 to fix Render deployment issue
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Deleted ⚠️",
      text: message,
    });
    console.log("Delete email sent to:", email);
  } catch (err) {
    console.log("DELETE EMAIL ERROR:", err);
  }
};
