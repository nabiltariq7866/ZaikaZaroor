import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, Divider, App } from "antd"; // 'App' import kiya
import { Mail, Lock, Chrome } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import Cookies from "js-cookie";
const LoginPage = () => {
  const { loginUser, googleAuth, loading } = useApi();
  const navigate = useNavigate();
  const { message } = App.useApp(); // Snackbar ke liye

  const onFinish = async (values) => {
    const result = await loginUser(values);

    if (result.success) {
      navigate("/");
    }
  };
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Backend ko Google user ka data bheja
      const googleResult = await googleAuth({
        email: result.user.email,
        fullName: result.user.displayName,
      });

      if (googleResult.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      message.error("Google Sign in failed."); // Fallback message
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden md:h-[85vh]">
        <div className="md:w-1/2 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            <span className="text-orange-600">Z</span>aika
            <span className="text-orange-600">Z</span>aroor
          </h2>

          <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
            Welcome Back!
          </h3>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, type: "email" }]}
              className="mb-3"
            >
              <Input
                prefix={<Mail className="text-gray-400" size={16} />}
                size="large"
                placeholder="you@example.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
              className="mb-3"
            >
              <Input.Password
                prefix={<Lock className="text-gray-400" size={16} />}
                size="large"
                placeholder="Your password"
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <div className="flex justify-between items-center">
                <Checkbox>Remember me</Checkbox>
                <Link
                  className="text-orange-600 hover:text-orange-700"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                htmlType="submit"
                size="large"
                block
                loading={loading.loginUser} // Loading state update ki
                className="bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-700 border-none"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider className="text-gray-400 my-4">OR</Divider>

          <Button
            onClick={handleGoogleSignUp}
            size="large"
            block
            icon={<Chrome size={20} className="mr-2" />}
            className="flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50"
            loading={loading.googleAuth} // Loading state update ki
          >
            Continue with Google
          </Button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link
              className="text-orange-600 hover:text-orange-700 font-semibold"
              to="/signup"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="md:w-1/2 hidden md:block">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1740&auto=format=fit=crop"
            alt="Welcome to ZaikaZaroor"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
