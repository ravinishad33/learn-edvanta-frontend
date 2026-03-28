
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
    // Show loading toast
    const toastId = toast.loading("Redirecting to GitHub...");

    try {
      loginWithRedirect({
        authorizationParams: {
          connection: "github",
        },
      });

      // Update toast to success
      toast.success("Redirecting to GitHub for login...", { id: toastId });
    } catch (error) {
      // Show error if redirect fails
      toast.error("Failed to initiate GitHub login.", { id: toastId });
      console.error("GitHub login error:", error);
    }
  };

  // handle Google Login auth0
  const handleGoogleLogin = () => {
    // Show loading toast
    const toastId = toast.loading("Redirecting to Google...");

    try {
      loginWithRedirect({
        authorizationParams: {
          connection: "google-oauth2",
        },
      });

      // Optionally update the toast immediately
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
    // Show a loading toast
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

      // redux store management

      dispatch(
        loginSuccess({
          user: userRes?.data?.user,
          token: userRes?.data?.token,
        }),
      );
      console.log("after redux");
      // redux store management

      // Redirect based on role
      // navigate("/profile");

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
      icon: <AcademicCapIcon className="h-8 w-8" />,
      label: "Student",
      description: "Access courses and learn",
    },
    {
      id: "instructor",
      icon: <UserGroupIcon className="h-8 w-8" />,
      label: "Instructor",
      description: "Teach and manage courses",
    },
    {
      id: "admin",
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      label: "Admin",
      description: "Manage platform",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue your learning journey
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Role Selection */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Select Your Role
            </h3>
            <div className="space-y-4">
              {roles.map((roleItem) => (
                <motion.button
                  key={roleItem.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(roleItem.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                    role === roleItem.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg ${
                        role === roleItem.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {roleItem.icon}
                    </div>
                    <div className="ml-4 text-left">
                      <div className="font-semibold text-gray-900">
                        {roleItem.label}
                      </div>
                      <div className="text-sm text-gray-600">
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
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-2xl shadow-xl"
          >
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter Email..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* login with social app  */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <GithubLoginButton onClick={handleGithubLogin} />
                <GoogleLoginButton onClick={handleGoogleLogin} />
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-800"
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
