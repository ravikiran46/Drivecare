import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Context/useAuth";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isprofileopen, setprofileopen] = useState(false);
  const { user } = useAuth();
  const profileMenuRef = useRef(null);

  const toggleProfileMenu = () => {
    setprofileopen(!isprofileopen);
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOutside = (event) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setprofileopen(false);
    }
  };
  useEffect(() => {
    if (isprofileopen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isprofileopen]);

  return (
    <nav className="bg-white border-gray-300 border-[1.5px] dark:bg-gray-900 dark:border-gray-700 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2.5">
        <a
          href={`/${user.role}`}
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Flowbite
          </span>
        </a>
        <div
          className="relative inline-flex items-center md:order-1"
          ref={profileMenuRef}
        >
          <button
            onClick={toggleProfileMenu}
            className="flex tex-sm focus:outline-none "
          >
            <span className="w-10 h-10 pt-1.5 font-medium bg-gray-200 rounded-full dark:bg-gray-500">
              {user.name[0]}
            </span>
          </button>

          {isprofileopen && (
            <div className="absolute right-0 z-50 w-48 py-2 bg-white border border-gray-600 rounded-lg shadow-lg mt-80">
              <div className="px-4 py-2 border-b-[1.5px] border-gray-600">
                <span className="block text-sm">{user?.name}</span>
                <span className="block text-sm font-medium text-gray-500 truncate">
                  {user?.mobileno}
                </span>
              </div>
              <div>
                <Link to={"/admin"}>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                    Dashboard
                  </button>
                </Link>
                <Link to={"/admin/service"}>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                    Services
                  </button>
                </Link>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                  Agents
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                  Bills & Recipts
                </button>
              </div>
              <div
                className="border-t-2 border-gray-600"
                onClick={handleLogout}
              >
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
