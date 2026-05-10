import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useAuth from "../Context/useAuth";

const NavBar = () => {
  const { token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isprofileopen, setprofileopen] = useState(false);
  const profileMenuRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Toggle theme and save to localStorage

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setprofileopen(!isprofileopen);

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

  const handlelogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-gray-300 border-[1.5px] dark:bg-gray-800 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2.5">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold text-gray-800 whitespace-nowrap">
            Drivecare
          </span>
        </a>

        <div className="flex space-x-4 item-center">
          {token && (
            <div
              className="relative flex items-center md:order-2"
              ref={profileMenuRef}
            >
              <button
                onClick={toggleProfileMenu}
                className="flex items-center text-sm focus:outline-none"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="User Avatar"
                />
              </button>

              {isprofileopen && (
                <div className="absolute right-0 z-50 w-48 py-2 bg-white border border-gray-600 rounded-lg shadow-lg mt-[17.5rem]">
                  <div className="px-4 py-2 border-b border-gray-600">
                    <span className="block text-sm ">{user?.name}</span>
                    <span className="block text-sm font-medium text-gray-500 truncate">
                      {user?.mobileno}
                    </span>
                  </div>
                  <div className="">
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                      <Link to={`/${user?.role}`}>Home</Link>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                      Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                      Earnings
                    </button>
                  </div>
                  <div
                    className="border-t border-gray-600 dark:border-gray-200"
                    onClick={handlelogout}
                  >
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-menu"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-menu"
        >
          <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:mt-0 md:text-sm md:border-0 md:bg-transparent md:space-x-8 md:rtl:space-x-reverse">
            <li>
              <Link to="/" className="block px-3 py-2 rounded text-violet-700">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Contact
              </Link>
            </li>
            {!token && (
              <li>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
