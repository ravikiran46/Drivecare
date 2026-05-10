import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Context/useAuth";
import { useState, useEffect, useRef } from "react";
// import { FaSun, FaMoon } from "react-icons/fa"; // Importing

const Nav = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isprofileopen, setprofileopen] = useState(false);
  const { user } = useAuth();
  const profileMenuRef = useRef(null);
  // const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // Theme state

  // const toggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   setTheme(newTheme);
  //   localStorage.setItem("theme", newTheme);
  // };

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

  // useEffect(() => {
  //   // Apply theme to the document body and navbar
  //   document.body.style.backgroundColor =
  //     theme === "dark" ? "#000000" : "#ffffff";
  // }, [theme]);

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
    <nav className="bg-white border-gray-300 border-[1.5px] dark:border-gray-400 ">
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
          className="relative flex items-center md:order-1"
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
            <div className="absolute right-0 z-50 w-48 py-2 bg-white border border-gray-600 rounded-lg shadow-lg mt-[22.5rem]">
              <div className="px-4 py-2 border-b-[1.5px] border-gray-600">
                <span className="block text-sm">{user?.name}</span>
                <span className="block text-sm font-medium text-gray-500 truncate">
                  {user?.mobileno}
                </span>
              </div>
              <div>
                <Link to={"/user"}>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                    Home
                  </button>
                </Link>
                <Link to={"/dashboard"}>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                    Dashboard
                  </button>
                </Link>
                <Link to={"/vehicles"}>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                    Vehicles
                  </button>
                </Link>
                <Link to={"/address"}>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                    My Parking Lots
                  </button>
                </Link>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200">
                  Help & Support
                </button>
              </div>
              <div className="border-t border-gray-600" onClick={handleLogout}>
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

export default Nav;
