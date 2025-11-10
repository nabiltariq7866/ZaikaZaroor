import express from "express";
import { forgotPassword, getProfile, googleAuth, login, logout, resetPassword, signUp, verifyOTP } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post('/register', signUp)
router.post('/verify-otp', verifyOTP)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.post('/google-auth', googleAuth)
router.put('/resetPassword/:token', resetPassword)
router.get('/logout', authMiddleware, logout)
router.get('/user', authMiddleware, getProfile)
export default router;