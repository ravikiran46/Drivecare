import { Outlet } from "react-router-dom";
import useAuth from "./Context/useAuth";
import PropTypes from "prop-types";
const ProtectedRoute = ({ allowedroles }) => {
  const { user } = useAuth();
  return allowedroles.includes(user && user.role) ? (
    <Outlet />
  ) : (
    <div className="w-screen text-xl text-white bg-black">
      Permission denied
    </div>
  );
};

ProtectedRoute.propTypes = {
  allowedroles: PropTypes.node.isRequired,
};
export default ProtectedRoute;
