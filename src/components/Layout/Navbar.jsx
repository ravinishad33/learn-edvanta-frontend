// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBook,
  FiVideo,
  FiUser,
  FiBell,
  FiSearch,
  FiLogOut,
  FiSettings,
  FiLogIn,
} from "react-icons/fi";
import { MdDashboard, MdSchool, MdLibraryBooks, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxUser = useSelector((state) => state?.auth?.user);
  const storedUser = localStorage.getItem("user");

  const user = reduxUser || (storedUser ? JSON.parse(storedUser) : null);
  const isLoggedIn = !!user;

  const apiUrl = import.meta.env.VITE_API_URL;

  const getNotification = async () => {
    try {
      const notificationRes = await axios.get(
        `${apiUrl}/api/users/notifications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(notificationRes?.data?.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  const getNavLinks = () => {
    if (!isLoggedIn) {
      return [
        { path: "/", label: "Home", icon: <FiHome /> },
        { path: "/courses", label: "Courses", icon: <MdSchool /> },
      ];
    }

    const links = [
      {
        path:
          user?.role === "student"
            ? "/student-dashboard"
            : user?.role === "instructor"
            ? "/instructor-dashboard"
            : "/admin-dashboard",
        label: "Dashboard",
        icon: <MdDashboard />,
      },
      { path: "/courses", label: "Courses", icon: <MdSchool /> },
      {
        path: user?.role === "admin" ? "/mycourses" : "/mycourses",
        label: user?.role === "admin" ? "Manage Courses" : "My Courses",
        icon: <MdLibraryBooks />,
      },
    ];

    if (user?.role === "instructor") {
      links.push({
        path: "/createcourse",
        label: "Create Course",
        icon: <FiBook />,
        highlight: true,
      });
    }

    if (user?.role === "admin") {
      links.push({
        path: "/categories",
        label: "Manage Categories",
        icon: <FiSettings />,
        highlight: true,
      });
    }

    return links;
  };

  const navLinks = getNavLinks();

  const userMenuLinks = [
    { path: "/profile", label: "Profile", icon: <FiUser /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
      if (notificationsOpen && !event.target.closest(".notifications-menu")) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen, notificationsOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      searchQuery("");
    }
  };

  const handleLogout = () => {
    const toastId = toast.loading("Logging out...");
    dispatch(logout());
    localStorage.clear();
    sessionStorage.clear();
    
    // Additional logout cleanup if using external auth providers like Auth0
    if (typeof window.logout === 'function') {
      window.logout({
        logoutParams: {
          returnTo: window.location.origin + "/login",
        },
      });
    }

    toast.success("Logged out successfully!", { id: toastId });

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <nav
        // UPDATED: Changed z-50 to z-[999] to ensure the entire nav sits above page content
        className={`sticky top-0 z-[999] transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-violet-100"
            : "bg-white border-b border-violet-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left side */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex-shrink-0 transition-transform active:scale-95 hover:opacity-80"
              >
                <img
                  src="/logo.png"
                  alt="Edvanta"
                  className="w-32 h-10 object-contain"
                />
              </Link>

              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    } ${
                      link.highlight
                        ? " shadow-sm border-none"
                        : ""
                    }`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3 md:space-x-4">
              
              <form
                onSubmit={handleSearch}
                className="hidden lg:block relative"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, lessons..."
                    className="w-64 pl-10 pr-4 py-2 border border-violet-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 text-sm"
                  />
                  <FiSearch className="absolute left-3 top-2.5 text-slate-400" />
                  <button
                    type="submit"
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    ↵
                  </button>
                </div>
              </form>

              {isLoggedIn ? (
                <>
                  <div className="relative notifications-menu">
                    <button
                      onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                        setUserMenuOpen(false);
                      }}
                      className="relative p-2 text-slate-500 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-colors"
                    >
                      <FiBell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="fixed inset-x-4 top-16 md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-3 md:w-80 bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden z-[1000] transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-5 py-4 bg-slate-50 flex justify-between items-center border-b border-violet-50">
                          <span className="font-bold text-slate-800">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {unreadCount} New
                            </span>
                          )}
                        </div>

                        <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className="px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0"
                              >
                                <p className="text-sm text-slate-700 leading-snug font-medium">
                                  {n.text}
                                </p>
                                <p className="text-xs text-slate-400 mt-1.5 font-medium flex items-center">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                      n.read ? "bg-slate-300" : "bg-violet-500"
                                    }`}
                                  ></span>
                                  {n.time}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="py-8 text-center text-slate-400 text-sm">
                              No new notifications
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="md:hidden w-full py-3 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-t border-slate-100 active:bg-slate-100"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative user-menu">
                    <button
                      onClick={() => {
                        setUserMenuOpen(!userMenuOpen);
                        setNotificationsOpen(false);
                      }}
                      className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <img
                        src={user?.avatar?.url || "https://via.placeholder.com/32"}
                        alt={user?.name || "User"}
                        className="w-8 h-8 rounded-full border border-violet-200 object-cover"
                      />
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-bold text-slate-800 leading-tight">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-violet-100 py-2 z-[1000] animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-slate-50 lg:hidden">
                          <p className="text-sm font-bold text-slate-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">
                            {user?.role}
                          </p>
                        </div>

                        <div className="py-1">
                          {userMenuLinks.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <span className="mr-3">{link.icon}</span>
                              {link.label}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-slate-50 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          >
                            <FiLogOut className="mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-violet-700 transition-colors"
                  >
                    <FiLogIn className="mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-sm hover:shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden px-4 pb-3 border-t border-violet-50 pt-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, lessons..."
                className="w-full pl-10 pr-4 py-2 border border-violet-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 text-sm"
              />
              <FiSearch className="absolute left-3 top-2.5 text-slate-400" />
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          // UPDATED: Added z-[1000] explicitly to the mobile dropdown menu
          className={`md:hidden transition-all duration-300 ease-in-out absolute w-full bg-white shadow-lg z-[1000] ${
            isOpen
              ? "max-h-[500px] opacity-100 border-b border-violet-50"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 my-1 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } ${
                  link.highlight
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                    : ""
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {!isLoggedIn ? (
              <div className="border-t border-violet-50 mt-3 pt-3 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <FiLogIn className="mr-3" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="border-t border-violet-50 mt-3 pt-3">
                {userMenuLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 my-1 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-violet-700"
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 my-1 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <FiLogOut className="mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div
          // UPDATED: Changed z-40 to z-[998] to block everything underneath but stay under the nav
          className="fixed inset-0 top-[110px] bg-slate-900/20 backdrop-blur-sm z-[998] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;