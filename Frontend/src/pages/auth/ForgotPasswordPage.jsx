import React from 'react';
import { Form, Input, Button, App } from 'antd';
import { Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';

const ForgotPasswordPage = () => {
  const { forgotPassword, loading } = useApi(); 
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const result = await forgotPassword(values);
      
      if (result.success) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Send reset link failed:', err);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden md:h-[85vh]">

        <div className="md:w-1/2 p-8 overflow-y-auto">
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            <span className="text-orange-600">Z</span>aika<span className="text-orange-600">Z</span>aroor
          </h2>

          <h3 className="text-xl font-semibold text-center text-gray-700 mb-2">
            Forgot Your Password?
          </h3>
          <p className="text-center text-gray-500 mb-4">
            No problem! Enter your email below to get reset instructions.
          </p>

          <Form
            name="forgot_password"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
              className="mb-3"
            >
              <Input 
                prefix={<Mail className="text-gray-400" size={16} />} 
                size="large" 
                placeholder="you@example.com" 
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button 
                htmlType="submit" 
                size="large" 
                block
                loading={loading?.forgotPassword}
                className="bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-700 border-none"
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-gray-600 mt-4">
            Remembered your password?{' '}
            <Link className="text-orange-600 hover:text-orange-700 font-semibold" to="/login">
              Back to Sign In
            </Link>
          </p>
        </div>

        <div className="md:w-1/2 hidden md:block">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1587&auto=format&fit=crop"
            alt="Forgot Password"
          />
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;

