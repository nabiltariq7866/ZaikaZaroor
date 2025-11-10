import React, { useEffect } from 'react';
import { Form, Input, Button, App } from 'antd';
import { Mail } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';

const VerifyOTPPage = () => {
  const { verifyOtp, loading } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      message.error("Email not found. Please sign up again.");
      navigate('/signup');
    }
  }, [email, navigate, message]);

  const onFinish = async (values) => {
    const payload = {
      email: email,
      verificationCode: values.verificationCode
    };

    try {
      const result = await verifyOtp(payload);
      if (result.success) {
        navigate('/login');
      }
    } catch (err) {
      console.error('OTP Verification failed:', err);
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
            Verify Your Account
          </h3>
          <p className="text-center text-gray-500 mb-4">
            A verification code has been sent to <strong className="text-gray-700">{email || 'your email'}</strong>.
          </p>

          <Form
            name="verify_otp"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              label="Email Address"
              className="mb-3"
            >
              <Input 
                prefix={<Mail className="text-gray-400" size={16} />} 
                size="large" 
                value={email}
                disabled
              />
            </Form.Item>

            {/* --- YAHAN CHANGE KIYA HAI --- */}
            <Form.Item
              name="verificationCode"
              label="Verification Code (OTP)"
              rules={[
                { required: true, message: 'Please input your OTP!' },
                { len: 6, message: 'OTP must be 6 digits!' }
              ]}
              className="mb-3"
            >
              {/* AntD ka OTP component use kiya */}
              <Input.OTP 
                size="large" 
                length={6} 
                className="w-full"
              />
            </Form.Item>
            {/* --- CHANGE KHATAM --- */}

            <Form.Item className="mb-0">
              <Button 
                htmlType="submit" 
                size="large" 
                block
                loading={loading.verifyOtp}
                className="bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-700 border-none"
              >
                Verify Account
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-gray-600 mt-4">
            Didn't receive code?{' '}
            <Link className="text-orange-600 hover:text-orange-700 font-semibold" to="/signup">
              Sign Up Again
            </Link>
          </p>
        </div>

        <div className="md:w-1/2 hidden md:block">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1565299711953-c3e1b7f180c4?q=80&w=1740&auto=format&fit=crop"
            alt="Verify OTP for ZaikaZaroor"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;