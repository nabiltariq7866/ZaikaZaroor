import React, { useState } from 'react';
import { Form, Input, Button, Divider, Modal, App } from 'antd'; 
import { Mail, Lock, User, Phone, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../context/ApiContext'; // Aapka context

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';

const SignUpPage = () => {
  // Context se naye functions nikalein
  const { registerUser, googleAuth, loading } = useApi(); 
  const navigate = useNavigate();
  const { message } = App.useApp(); // AntD App context se snackbar
  
  const [role, setRole] = useState('user');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [modalRole, setModalRole] = useState('user');
  const [modalForm] = Form.useForm();

  const onFinish = async (values) => {
    // 'role' ko form values ke sath milayein
    const payload = { ...values, role };
    try {
      // Naya function 'registerUser' call karein
      const result = await registerUser(payload);
      
      if (result.success) {
        // Backend flow ke mutabiq, ab OTP page par navigate karein
        // Hum 'email' ko state mein pass kar rahe hain taake OTP page usay use kar sake
        navigate('/verify-otp', { state: { email: values.email } });
      }
      // Context ab success/error message khud dikha dega
    } catch (err) {
      console.error('Sign Up failed:', err);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setGoogleUserData({
        email: result.user.email,
        fullName: result.user.displayName
      });
      setIsModalVisible(true);
      modalForm.resetFields();
      setModalRole('user');
    } catch (error) {
      // Yeh Firebase ka error hai, context isay handle nahi karega
      console.error("Google Sign Up Error:", error);
      message.error("Google Sign up failed. Please try again.");
    }
  };

  const handleModalFinish = async (values) => {
    const { mobile } = values;
    const finalData = {
      fullName: googleUserData.fullName,
      email: googleUserData.email,
      mobile: mobile,
      role: modalRole
    };

    try {
      // Naya function 'googleAuth' call karein
      const result = await googleAuth(finalData);
      
      if (result.success) {
        // Context success message dikha dega
        setIsModalVisible(false);
        navigate('/'); // Google auth seedha login kar deta hai
      }
    } catch (err) {
      console.error('Google Sign Up failed (backend):', err);
      // Context error message dikha dega
    }
  };

  const getRoleButtonClass = (buttonRole, activeRole) => {
    if (activeRole === buttonRole) {
      return 'bg-orange-600 text-white border-orange-600';
    }
    return 'bg-white text-gray-700 border-gray-300 hover:border-orange-500';
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden md:h-[85vh]">
        <div className="md:w-1/2 hidden md:block">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?q=80&w=1587&auto=format&fit=crop"
            alt="Sign up for ZaikaZaroor"
          />
        </div>
        <div className="md:w-1/2 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            <span className="text-orange-600">Z</span>aika<span className="text-orange-600">Z</span>aroor
          </h2>
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
            Create Your Account
          </h3>
          <Form name="signup" onFinish={onFinish} layout="vertical" requiredMark={false}>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]} className="mb-3">
              <Input prefix={<User className="text-gray-400" size={16} />} size="large" placeholder="Enter your Full Name" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]} className="mb-3">
              <Input prefix={<Mail className="text-gray-400" size={16} />} size="large" placeholder="Enter your Email" />
            </Form.Item>
            <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]} className="mb-3">
              <Input prefix={<Phone className="text-gray-400" size={16} />} size="large" placeholder="Enter your Mobile Number" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]} className="mb-3">
              <Input.Password prefix={<Lock className="text-gray-400" size={16} />} size="large" placeholder="Enter your password" />
            </Form.Item>
            <Form.Item label="Role" className="mb-4">
              <div className="flex space-x-2">
                <button type="button" onClick={() => setRole('user')} className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all border ${getRoleButtonClass('user', role)}`}>user</button>
                <button type="button" onClick={() => setRole('owner')} className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all border ${getRoleButtonClass('owner', role)}`}>owner</button>
                <button type="button" onClick={() => setRole('deliveryBoy')} className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all border ${getRoleButtonClass('deliveryBoy', role)}`}>deliveryBoy</button>
              </div>
            </Form.Item>
            <Form.Item className="mb-0">
              <Button
                htmlType="submit"
                size="large"
                block
                loading={loading.registerUser} 
                className="bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-700 border-none"
              >
                Sign Up
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
            loading={loading.googleAuth} 
          >
            Continue with Google
          </Button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link className="text-orange-600 hover:text-orange-700 font-semibold" to="/login">Sign In</Link>
          </p>
        </div>
      </div>
      <Modal
        title="Complete Your Profile"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <p className="text-gray-600 mb-4">Welcome <strong className="text-gray-800">{googleUserData?.fullName}</strong>! Please provide the remaining details.</p>
        <Form form={modalForm} name="google_complete" onFinish={handleModalFinish} layout="vertical" requiredMark={false}>
          <Form.Item label="Email" className="mb-3">
            <Input size="large" value={googleUserData?.email} disabled />
          </Form.Item>
          <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]} className="mb-3">
            <Input prefix={<Phone className="text-gray-400" size={16} />} size="large" placeholder="Enter your Mobile Number" />
          </Form.Item>
          <Form.Item label="Role" className="mb-4">
            <div className="flex space-x-2">
              <button type="button" onClick={() => setModalRole('user')} className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all border ${getRoleButtonClass('user', modalRole)}`}>user</button>
              <button type="button" onClick={() => setModalRole('owner')} className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all border ${getRoleButtonClass('owner', modalRole)}`}>owner</button>
              <button type="button" onClick={() => setModalRole('deliveryBoy')} className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all border ${getRoleButtonClass('deliveryBoy', modalRole)}`}>deliveryBoy</button>
            </div>
          </Form.Item>
          <Form.Item className="mb-0">
            <Button
              htmlType="submit"
              size="large"
              block
              loading={loading.googleAuth} 
              className="bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-700 border-none"
            >
              Complete Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SignUpPage;