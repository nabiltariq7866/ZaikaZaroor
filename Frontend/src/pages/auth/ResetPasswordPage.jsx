import React from "react";
import { Form, Input, Button, App } from "antd";
import { Lock } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../context/ApiContext";

const ResetPasswordPage = () => {
  const { resetPassword, loading } = useApi();
  const navigate = useNavigate();
  const { token } = useParams(); // (1) URL se token yahan milega
  const { message } = App.useApp();

  const onFinish = async (values) => {
    if (!token) {
      message.error("Invalid or missing reset token.");
      return;
    }
    const result = await resetPassword(token, values);
    if (result.success) {
      navigate("/login");
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
            Set a New Password
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Please create a new password for your account.
          </p>

          <Form
            name="reset_password"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please create a new password!" },
              ]}
              className="mb-3"
            >
              <Input.Password
                prefix={<Lock className="text-gray-400" size={16} />}
                size="large"
                placeholder="Enter new password"
              />
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]} // (4) Password match validation
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
              className="mb-3"
            >
              <Input.Password
                prefix={<Lock className="text-gray-400" size={16} />}
                size="large"
                placeholder="Confirm your new password"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                htmlType="submit"
                size="large"
                block
                loading={loading.resetPassword} // (5) Loading state
                className="bg-orange-600 text-white hover:bg-orange-700 focus:bg-orange-700 border-none"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-gray-600 mt-4">
            Remembered your password?{" "}
            <Link
              className="text-orange-600 hover:text-orange-700 font-semibold"
              to="/login"
            >
              Back to Sign In
            </Link>
          </p>
        </div>

        <div className="md:w-1/2 hidden md:block">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1587&auto=format&fit=crop"
            alt="Reset Password"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
