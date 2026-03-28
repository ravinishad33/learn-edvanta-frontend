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

  // Get user from Redux store
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
        },
      );

      // You can set it to state if using React
      setNotifications(notificationRes?.data?.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Call it in useEffect if using React
  useEffect(() => {
    getNotification();
  }, []);

  // Navigation links - Dynamic based on auth state
  const getNavLinks = () => {
    if (!isLoggedIn) {
      // Logged out: Only Home and Courses
      return [
        { path: "/", label: "Home", icon: <FiHome /> },
        { path: "/courses", label: "Courses", icon: <MdSchool /> },
      ];
    }

    // Logged in: No Home, role-based dashboard and tabs
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

    // Instructor: show "Create Course"
    if (user?.role === "instructor") {
      links.push({
        path: "/createcourse",
        label: "Create Course",
        icon: <FiBook />,
        highlight: true,
      });
    }

    // Admin: show "Manage Categories"
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

  // User menu links (only for logged in)
  const userMenuLinks = [
    { path: "/profile", label: "Profile", icon: <FiUser /> },
    // { path: "/settings", label: "Settings", icon: <FiSettings /> },
    // { path: "/help", label: "Help Center", icon: <FiHelpCircle /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
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

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    // Clear Redux and localStorage
    const toastId = toast.loading("Logging out...");
    dispatch(logout());
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
    localStorage.clear();
    logout({
      logoutParams: {
        returnTo: window.location.origin + "/login",
      },
    });

    // Show toast
    toast.success("Logged out successfully!", { id: toastId });

    // Delay navigation so toast is visible
    setTimeout(() => {
      navigate("/login");
    }, 500); // 500ms delay
  };

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Desktop Navigation */}
            <div className="flex items-center">
              {/* Logo */}
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

              {/* Desktop Navigation Links */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    } ${
                      link.highlight
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                        : ""
                    }`}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - Search, Notifications, User Menu OR Auth Buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Bar - Desktop (Show for both logged in and out) */}
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
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  >
                    ↵
                  </button>
                </div>
              </form>




              {isLoggedIn ? (
                <>
                  {/* Notifications - Only when logged in */}
                  <div className="relative notifications-menu">
                    <button
                      onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                        setUserMenuOpen(false);
                      }}
                      className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiBell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

















                    {notificationsOpen && (
                      <div
                        className="
          /* 1. POSITIONING LOGIC */
          fixed inset-x-4 top-20        /* Mobile: Centered horizontally with 1rem margin */
          md:absolute md:inset-x-auto   /* Desktop: Reset horizontal centering */
          md:right-0 md:top-full md:mt-4 /* Desktop: Align to the button's right edge */
          
          /* 2. SIZING LOGIC */
          max-w-[calc(100vw-2rem)]      /* Mobile: Prevent screen overflow */
          md:w-80                       /* Desktop: Fixed width */
          
          /* 3. VISUALS */
          bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
          border border-slate-100 overflow-hidden z-[100] 
          transform origin-top md:origin-top-right animate-in fade-in zoom-in duration-200
        "
                      >
                        <div className="px-6 py-5 bg-slate-50/50 flex justify-between items-center border-b border-slate-100">
                          <span className="font-bold text-slate-900">
                            Notifications
                          </span>
                          <span className="text-[10px] bg-purple-600 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                            {unreadCount} New
                          </span>
                        </div>

                        <div className="max-h-[60vh] md:max-h-80 overflow-y-auto custom-scrollbar">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0"
                              >
                                <p className="text-sm text-slate-700 leading-snug font-medium">
                                  {n.text}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1.5 font-bold flex items-center">
                                  <span
                                    className={`w-1 h-1 rounded-full mr-2 ${n.read ? "bg-slate-300" : "bg-purple-500"}`}
                                  ></span>
                                  {n.time}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="py-10 text-center text-slate-400 text-sm italic">
                              No new notifications
                            </div>
                          )}
                        </div>

                        {/* Mobile-only Close Trigger */}
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="md:hidden w-full py-4 text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-t border-slate-100"
                        >
                          Close
                        </button>
                      </div>
                    )}















                  </div> 


                  

                  {/* User Menu - Only when logged in */}
                  <div className="relative user-menu">
                    <button
                      onClick={() => {
                        setUserMenuOpen(!userMenuOpen);
                        setNotificationsOpen(false);
                      }}
                      className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={
                          user?.avatar?.url || "https://via.placeholder.com/32"
                        }
                        alt={user?.name || "User"}
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                      />
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role}
                        </p>
                      </div>
                    </button>


                   

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {user?.role}
                          </p>
                        </div>

                        <div className="py-2">
                          {userMenuLinks.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <span className="mr-3">{link.icon}</span>
                              {link.label}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
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
                /* Auth Buttons - Only when logged out */
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <FiLogIn className="mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden px-4 pb-3 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, lessons..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-[500px] opacity-100 border-t border-gray-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 py-3 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 my-1 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                } ${
                  link.highlight
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                    : ""
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {!isLoggedIn ? (
              <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FiLogIn className="mr-3" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              /* Mobile User Menu Links - Only when logged in */
              <div className="border-t border-gray-100 mt-3 pt-3">
                {userMenuLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 my-1 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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
                  className="flex items-center w-full px-4 py-3 my-1 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
