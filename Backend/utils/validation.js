// utils/validators.js

// ✅ Email regex
const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// 📱 Phone regex (Pakistan format: +923XXXXXXXXX or 03XXXXXXXXX)
const phoneRegex = /^(\+92|0)3\d{9}$/;

// 🔒 Password regex (Strong, 8+ chars, no spaces)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;

// 🧑 Username regex (3–20 chars, letters, numbers, underscores, dots)
const usernameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]{3,20}(?<![_.])$/;

/**
 * ✅ Unified validator that returns { valid: boolean, message: string }
 */

export function validateEmail(email) {
  if (!email) return { valid: false, message: "Email is required." };
  if (!emailRegex.test(email))
    return { valid: false, message: "Please enter a valid email address." };
  return { valid: true, message: "" };
}

export function validatePhone(phone) {
  if (!phone) return { valid: false, message: "Phone number is required." };
  if (!phoneRegex.test(phone))
    return { valid: false, message: "Invalid Pakistani phone number format." };
  return { valid: true, message: "" };
}

export function validatePassword(password) {
  if (!password) return { valid: false, message: "Password is required." };
  if (!passwordRegex.test(password))
    return {
      valid: false,
      message:
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
    };
  return { valid: true, message: "" };
}

export function validateUsername(username) {
  if (!username) return { valid: false, message: "Username is required." };
  if (!usernameRegex.test(username))
    return {
      valid: false,
      message:
        "Username must be 3–20 characters, letters/numbers only, no spaces or special characters.",
    };
  return { valid: true, message: "" };
}
