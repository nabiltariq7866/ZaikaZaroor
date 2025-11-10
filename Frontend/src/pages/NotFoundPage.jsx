import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom'; // Link use karein gay takay page refresh na ho
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="404"
        title="404 - Page Not Found"
        subTitle="Sorry, the page you are looking for does not exist."
        extra={
          // Yeh Button AntD ka hai, lekin hamari index.css ki wajah se Orange hoga
          <Link to="/">
            <Button type="primary" size="large" icon={<Home size={16} />}>
              Back to Home
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFoundPage;