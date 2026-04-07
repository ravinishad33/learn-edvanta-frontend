// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu, FiX, FiHome, FiBook, FiVideo, FiUser,
  FiBell, FiSearch, FiLogOut, FiSettings, FiLogIn
} from "react-icons/fi";
import { MdDashboard, MdSchool, MdLibraryBooks } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
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
      const res = await axios.get(`${apiUrl}/api/users/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) getNotification();
  }, [isLoggedIn]);

  const navLinks = isLoggedIn ? [
    {
      path: user?.role === "student" ? "/student-dashboard" : user?.role === "instructor" ? "/instructor-dashboard" : "/admin-dashboard",
      label: "Dashboard",
      icon: <MdDashboard />,
    },
    { path: "/courses", label: "Courses", icon: <MdSchool /> },
    {
      path: "/mycourses",
      label: user?.role === "admin" || user?.role === "instructor" ? "Manage" : "My Learning",
      icon: <MdLibraryBooks />,
    },
    ...(user?.role === "instructor" ? [{ path: "/createcourse", label: "Create", icon: <FiBook />, highlight: true }] : []),
    ...(user?.role === "admin" ? [{ path: "/categories", label: "Categories", icon: <FiSettings />, highlight: true }] : []),
  ] : [
    { path: "/", label: "Home", icon: <FiHome /> },
    { path: "/courses", label: "Courses", icon: <MdSchool /> },
  ];

  const userMenuLinks = [{ path: "/profile", label: "My Profile", icon: <FiUser /> }];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest(".user-menu")) setUserMenuOpen(false);
      if (notificationsOpen && !event.target.closest(".notifications-menu")) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen, notificationsOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    const toastId = toast.loading("Logging out...");
    dispatch(logout());
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully!", { id: toastId });
    setTimeout(() => navigate("/login"), 500);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <nav className={`sticky top-0 z-[999] transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-[#E6E6FA]/50" : "bg-white border-b border-[#FAF7FF]"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20">
            
            {/* Logo & Desktop Links */}
            <div className="flex items-center">
              <Link to="/" className="shrink-0 transition-transform active:scale-95">
                <img src="/logo.png" alt="Edvanta" className="w-24 sm:w-32 h-auto object-contain" />
              </Link>

              <div className="hidden lg:flex ml-8 space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${location.pathname === link.path ? "bg-[#FAF7FF] text-[#7A589B]" : "text-gray-500 hover:bg-[#FAF7FF]/50 hover:text-[#5E4B8A]"} ${link.highlight ? "bg-gradient-to-r from-[#B19CD9] to-[#967BB6] text-white shadow-md" : ""}`}
                  >
                    <span className="mr-2 text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden md:block relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-40 lg:w-64 pl-10 pr-4 py-2 border-2 border-[#E6E6FA] rounded-xl focus:outline-none focus:border-[#B19CD9] bg-gray-50/50 text-sm font-medium transition-all"
                />
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#967BB6]" />
              </form>

              {isLoggedIn ? (
                <>
                  {/* --- RESPONSIVE NOTIFICATIONS --- */}
                  <div className="relative notifications-menu">
                    <button 
                      onClick={() => { setNotificationsOpen(!notificationsOpen); setUserMenuOpen(false); }} 
                      className={`relative p-2 rounded-xl transition-colors ${notificationsOpen ? 'bg-[#FAF7FF] text-[#7A589B]' : 'text-gray-500 hover:bg-[#FAF7FF]'}`}
                    >
                      <FiBell className="w-6 h-6" />
                      {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                    </button>

                    <AnimatePresence>
                      {notificationsOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                          animate={{ opacity: 1, y: 0, scale: 1 }} 
                          exit={{ opacity: 0, y: 15, scale: 0.95 }} 
                          className="fixed inset-x-4 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E6E6FA] overflow-hidden z-[1000] origin-top-right"
                        >
                          <div className="px-5 py-4 bg-[#FAF7FF] border-b border-[#E6E6FA]/50 flex justify-between items-center">
                            <span className="font-bold text-[#5E4B8A]">Notifications</span>
                            {unreadCount > 0 && <span className="text-[10px] bg-[#E6E6FA] text-[#7A589B] px-2 py-0.5 rounded-lg font-bold">NEW</span>}
                          </div>
                          <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? notifications.map((n) => (
                              <div key={n.id} className="px-5 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer group transition-colors">
                                <p className="text-sm font-medium text-gray-700 leading-snug group-hover:text-[#5E4B8A]">{n.text}</p>
                                <p className="text-[11px] text-gray-400 mt-1 font-semibold italic">{n.time || 'Just now'}</p>
                              </div>
                            )) : (
                              <div className="py-12 text-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                   <FiBell className="text-gray-300" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">No new updates</p>
                              </div>
                            )}
                          </div>
                          {/* Close button for mobile to improve UX */}
                          <button 
                            className="w-full py-3 bg-gray-50 text-xs font-bold text-gray-400 sm:hidden"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            Close
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Menu */}
                  <div className="relative user-menu">
                    <button onClick={() => { setUserMenuOpen(!userMenuOpen); setNotificationsOpen(false); }} className="flex items-center space-x-2 p-1 rounded-xl hover:bg-[#FAF7FF] transition-all border border-transparent">
                      <img src={user?.avatar?.url || "https://via.placeholder.com/32"} alt={user?.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-[#E6E6FA] object-cover" />
                      <div className="hidden sm:block text-left">
                        <p className="text-xs font-black text-[#5E4B8A] leading-tight">{user?.name?.split(' ')[0]}</p>
                        <p className="text-[10px] text-[#967BB6] font-bold uppercase">{user?.role}</p>
                      </div>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-[#E6E6FA] py-2 z-[1000]">
                          {userMenuLinks.map((link) => (
                            <Link key={link.path} to={link.path} onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-[#FAF7FF] hover:text-[#7A589B] mx-2 rounded-xl">
                              <span className="mr-3 text-lg">{link.icon}</span>{link.label}
                            </Link>
                          ))}
                          <button onClick={handleLogout} className="flex items-center w-[calc(100%-16px)] mx-2 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl mt-1 border-t border-gray-50 pt-2">
                            <FiLogOut className="mr-3 text-lg" /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-500">Login</Link>
                  <Link to="/register" className="px-5 py-2.5 rounded-xl text-sm font-black bg-[#967BB6] text-white shadow-lg">Join</Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-xl text-[#7A589B] bg-[#FAF7FF]">
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden bg-white border-b border-[#E6E6FA] overflow-hidden shadow-2xl">
              <div className="px-4 py-6 space-y-2">
                <form onSubmit={handleSearch} className="relative mb-6 md:hidden">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-[#E6E6FA] rounded-2xl focus:outline-none text-sm font-bold"
                  />
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </form>

                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-4 rounded-2xl text-sm font-bold transition-all ${location.pathname === link.path ? "bg-[#FAF7FF] text-[#7A589B]" : "text-gray-500"}`}
                  >
                    <span className="mr-4 text-xl">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}

                {!isLoggedIn && (
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 mt-4">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="py-4 text-center text-sm font-black text-gray-500 bg-gray-50 rounded-2xl">Login</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="py-4 text-center text-sm font-black text-white bg-[#967BB6] rounded-2xl">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-[#5E4B8A]/20 backdrop-blur-sm z-[998] lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Navbar;