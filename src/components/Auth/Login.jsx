import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import axios from "axios";
import GithubLoginButton from "./GithubLoginButton ";
import GoogleLoginButton from "./GoogleLoginButton ";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";
import toast from "react-hot-toast";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { loginWithRedirect } = useAuth0();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const apiUrl = import.meta.env.VITE_API_URL;

  // handle Github Login auth0
  const handleGithubLogin = () => {
    const toastId = toast.loading("Redirecting to GitHub...");
    try {
      loginWithRedirect({
        authorizationParams: {
          connection: "github",
        },
      });
      toast.success("Redirecting to GitHub for login...", { id: toastId });
    } catch (error) {
      toast.error("Failed to initiate GitHub login.", { id: toastId });
      console.error("GitHub login error:", error);
    }
  };

  // handle Google Login auth0
  const handleGoogleLogin = () => {
    const toastId = toast.loading("Redirecting to Google...");
    try {
      loginWithRedirect({
        authorizationParams: {
          connection: "google-oauth2",
        },
      });
      toast.success("Redirecting to Google for login...", { id: toastId });
    } catch (error) {
      toast.error("Failed to initiate Google login.", { id: toastId });
      console.error("Google login error:", error);
    }
  };

  // handling login api
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const userRes = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
      });

      toast.success(userRes?.data?.message || "Login successful!", {
        id: toastId,
      });
      localStorage.setItem("token", userRes?.data?.token);
      setUser(userRes?.data?.user);

      dispatch(
        loginSuccess({
          user: userRes?.data?.user,
          token: userRes?.data?.token,
        }),
      );
      console.log("after redux");

      if (userRes?.data?.user?.role === "student")
        navigate("/student-dashboard");
      else if (userRes?.data?.user?.role === "instructor")
        navigate("/instructor-dashboard");
      else if (userRes?.data?.user?.role === "admin")
        navigate("/admin-dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Login failed!",
        { id: toastId },
      );
      console.log("login error ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: "student",
      icon: <AcademicCapIcon className="h-6 w-6 sm:h-7 sm:w-7" />,
      label: "Student",
      description: "Access courses and learn",
    },
    {
      id: "instructor",
      icon: <UserGroupIcon className="h-6 w-6 sm:h-7 sm:w-7" />,
      label: "Instructor",
      description: "Teach and manage courses",
    },
    {
      id: "admin",
      icon: <ShieldCheckIcon className="h-6 w-6 sm:h-7 sm:w-7" />,
      label: "Admin",
      description: "Manage platform",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FAF7FF] via-white to-[#E6E6FA] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-5xl w-full space-y-6 sm:space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-6 shadow-lg shadow-[#B19CD9]/30 overflow-hidden bg-white">
              <img src="Icon.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium px-4">
              Sign in to continue your learning journey
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Column - Role Selection */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-xl p-5 sm:p-8 rounded-[2rem] shadow-xl shadow-[#E6E6FA]/60 border border-white flex flex-col h-full"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6 text-center lg:text-left">
              Select Your Role
            </h3>
            <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-center">
              {roles.map((roleItem) => (
                <motion.button
                  key={roleItem.id}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(roleItem.id)}
                  className={`w-full p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-300 ease-out text-left ${
                    role === roleItem.id
                      ? "border-[#B19CD9] bg-[#FAF7FF] shadow-sm"
                      : "border-gray-100 hover:border-[#D8BFD8] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center w-full">
                    <div
                      className={`shrink-0 p-2.5 sm:p-3 rounded-xl transition-colors duration-300 ${
                        role === roleItem.id
                          ? "bg-[#E6E6FA] text-[#7A589B]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {roleItem.icon}
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                      <div className={`font-bold text-sm sm:text-base truncate ${role === roleItem.id ? "text-[#5E4B8A]" : "text-gray-900"}`}>
                        {roleItem.label}
                      </div>
                      <div className={`text-xs sm:text-sm mt-0.5 truncate ${role === roleItem.id ? "text-[#7A589B]" : "text-gray-500"}`}>
                        {roleItem.description}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-xl p-5 sm:p-8 rounded-[2rem] shadow-xl shadow-[#E6E6FA]/60 border border-white flex flex-col h-full"
          >
            <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6 flex-1 flex flex-col justify-center">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <EnvelopeIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#967BB6] transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 w-full px-4 py-3 sm:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#E6E6FA] focus:border-[#B19CD9] transition-all outline-none text-sm sm:text-base"
                    placeholder="Email Address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <LockClosedIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#967BB6] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-12 w-full px-4 py-3 sm:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#E6E6FA] focus:border-[#B19CD9] transition-all outline-none text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-[#F4EFFF] transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 accent-[#967BB6] text-[#967BB6] focus:ring-[#B19CD9] border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-xs sm:text-sm text-gray-600 font-medium cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm font-bold text-[#7A589B] hover:text-[#5E4B8A] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#B19CD9] to-[#967BB6] text-white py-3 sm:py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base shadow-lg shadow-[#B19CD9]/30 hover:shadow-[#967BB6]/40 hover:from-[#A685E2] hover:to-[#8A63A6] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            <div className="mt-6 sm:mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <GithubLoginButton onClick={handleGithubLogin} className="w-full" />
                </div>
                <div className="flex-1">
                  <GoogleLoginButton onClick={handleGoogleLogin} className="w-full" />
                </div>
              </div>
            </div>

            <p className="mt-6 sm:mt-8 text-center text-sm text-gray-500 font-medium">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#7A589B] hover:text-[#5E4B8A] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;