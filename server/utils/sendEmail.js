import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "noreply@portlab.in",
      to: email,
      subject: "OTP Verification",
      html: `
        <h2>OTP Verification</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });
  } catch (err) {
    console.log("Email sending error:", err);
    throw err;
  }
};

export const sendApprovalEmail = async (email, message) => {
  try {
    await resend.emails.send({
      from: "noreply@portlab.in",
      to: email,
      subject: "Account Approved",
      html: message,
    });
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    throw err;
  }
};

export const sendRejectionEmail = async (email, message) => {
  try {
    await resend.emails.send({
      from: "noreply@portlab.in",
      to: email,
      subject: "Account Rejected ❌",
      html: message,
    });
  } catch (err) {
    console.log("REJECTION EMAIL ERROR:", err);
    throw err;
  }
};

export const sendPendingEmail = async (email, message) => {
  try {
    await resend.emails.send({
      from: "noreply@portlab.in",
      to: email,
      subject: "Account Pending Approval ⏳",
      html: message,
    });
  } catch (err) {
    console.log("PENDING EMAIL ERROR:", err);
    throw err;
  }
};

export const sendDeleteEmail = async (email, message) => {
  try {
    await resend.emails.send({
      from: "noreply@portlab.in",
      to: email,
      subject: "Account Deleted ⚠️",
      html: message,
    });
  } catch (err) {
    console.log("DELETE EMAIL ERROR:", err);
    throw err;
  }
};
