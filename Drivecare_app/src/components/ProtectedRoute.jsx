import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./Context/useAuth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedroles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  if (!allowedroles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-white bg-black">
        Permission denied
      </div>
    );
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedroles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default ProtectedRoute;
