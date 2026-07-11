import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./Context/useAuth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedroles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center h-screen text-xl item-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/Login" />;
  }

  if (!allowedroles.includes(user.role)) {
    return (
      <div className="flex justify-center h-screen text-xl item-center">
        You don&apos;t have access to this page
      </div>
    );
  }
  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedroles: PropTypes.node.isRequired,
};
export default ProtectedRoute;
