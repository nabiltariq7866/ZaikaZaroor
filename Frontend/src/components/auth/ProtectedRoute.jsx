import { useApi } from "../../context/ApiContext"; 
import { Navigate, useLocation, Link } from "react-router-dom";
import { Spin, Result, Button } from "antd";
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}) => {
  const {isAuthenticated, user, loading } = useApi();
  const location = useLocation();

  if (loading?.getProfile) {
    return <Spin fullscreen size="large" tip="Loading your session..." />;
  }
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Result
        status="403"
        title="403 - Forbidden"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary">
            <Link to="/">Go Home</Link>
          </Button>
        }
      />
    );
  }

  return children;
};

export default ProtectedRoute;
