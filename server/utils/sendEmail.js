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
  //   const response = await resend.emails.send({
  //     from: "noreply@portlab.in",
  //     to: email,
  //     subject: "OTP Verification",
  //     html: `
  //   <h2>OTP Verification</h2>
  //   <h1>${otp}</h1>
  //   <p>Valid for 5 minutes</p>
  // `,
  //   });
  //   console.log("RESEND RESPONSE:", response);
    console.log("OTP email sent to:", email);
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
    console.log("Approval email sent to:", email);
  } catch (err) {
    console.log("EMAIL ERROR:", err);
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
    console.log("Rejection email sent to:", email);
  } catch (err) {
    console.log("REJECTION EMAIL ERROR:", err);
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
    console.log("Pending email sent to:", email);
  } catch (err) {
    console.log("PENDING EMAIL ERROR:", err);
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
    console.log("Delete email sent to:", email);
  } catch (err) {
    console.log("DELETE EMAIL ERROR:", err);
  }
};
