import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
} from "../utils/validation.js";
import crypto from "crypto"; 
export const signUp = async (req, res) => {
  try {
    console.log(req.body);

    const { fullName, email, password, role, mobile } = req.body;

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email, accountVerified: true });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This user is already registered.",
      });
    }

    // ✅ Run all field validations
    const validations = [
      validateEmail(email),
      validateUsername(fullName),
      validatePassword(password),
      validatePhone(mobile),
    ];

    // 🚫 If any validation fails, return the first error
    const invalid = validations.find((v) => !v.valid);
    if (invalid) {
      return res.status(400).json({
        success: false,
        message: invalid.message,
      });
    }
    const userAdd = new User({
      fullName,
      email,
      password,
      mobile,
      role,
      accountVerified: false,
    });
    const verificationCode =await userAdd.generateVerificationCode();
    userAdd.verificationCode = verificationCode;
    userAdd.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await userAdd.save();

    // 📧 Send verification email
    try {
      await sendVerificationCode(verificationCode, email);

      return res.status(201).json({
        success: true,
        message: "User registered successfully. Verification code sent.",
      });
    } catch (err) {
      console.error("❌ Email sending failed:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again later.",
        error: err.message,
      });
    }
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};
async function sendVerificationCode(verificationCode, email) {
  const message = generateEmailTemplate(verificationCode);
  try {
    await sendEmail(email, "Your Verification Code", message);
  } catch (err) {
    throw new Error("Failed to send verification email");
  }
}
function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email/phone. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}
export const verifyOTP = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email  is required" });
    }
    if (!verificationCode) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    // ✅ Find all unverified users with same email or phone (latest first)
    const users = await User.find({ email, accountVerified: false }).sort({
      createdAt: -1,
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Get the latest entry
    let lastEntry = users[0];

    // ✅ Remove duplicates (if multiple unverified exist)
    if (users.length > 1) {
      await User.deleteMany({
        _id: { $ne: lastEntry._id },
        $or: [{ email, accountVerified: false }],
      });
    }
    // ✅ Check verification code
    if (lastEntry.verificationCode !== verificationCode.toString()) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // ✅ Check expiry
    const currentTime = new Date();
    const codeExpireTime = new Date(lastEntry.verificationCodeExpire).getTime();

    if (currentTime > codeExpireTime) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // ✅ Mark account verified
    lastEntry.accountVerified = true;
    lastEntry.verificationCode = null;
    lastEntry.verificationCodeExpire = null;

    await lastEntry.save({ validateModifiedOnly: true });
    res.status(200).json({
      message: "Account verified successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const check = [validateEmail(email), validatePassword(password)];
    const invalid = check.find((c) => !c.valid);
    if (invalid)
      return res.status(400).json({ success: false, message: invalid.message });

    const user = await User.findOne({ email, accountVerified: true });
   
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
     if (!user.password) {
      return res
        .status(401)
        .json({ 
          success: false, 
          message: "This account uses Google Sign-In. Please use 'Continue with Google'." 
        });
    }
    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Send JWT token
    sendToken(user, 200, "Login successful", res);
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error:error.message });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // from authMiddleware
    const token = req.token; // from authMiddleware
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   return res.status(200).json({ success: true, user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const check = [validateEmail(email)];
    const invalid = check.find((c) => !c.valid);
    if (invalid)
      return res.status(400).json({ success: false, message: invalid.message });
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
      res.status(401).json({ message: "invalid email" });
    }
    const resetPasswordToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;
    const message = `
      <div>
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 10 minutes.</p>
      </div>
    `;
    try {
      await sendEmail(email, "Password Reset Request", message);
      res.status(200).json({ message: "Reset link sent to your email" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res
        .status(500)
        .json({ message: "Failed to send reset link", error: error.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;
    if (!newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password are required" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile,role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ fullName, email, mobile,role,accountVerified:true });
    }
    sendToken(user, 200, "Login successful", res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
