// src/pages/Register.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import GithubLoginButton from "../components/Auth/GithubLoginButton ";
import GoogleLoginButton from "../components/Auth/GoogleLoginButton ";

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "Enter a password",
    color: "text-gray-500",
    progressColor: "bg-gray-300",
    requirements: {},
  });

  const requirements = [
    { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
    { id: "uppercase", label: "One uppercase letter", regex: /[A-Z]/ },
    { id: "lowercase", label: "One lowercase letter", regex: /[a-z]/ },
    { id: "number", label: "One number", regex: /[0-9]/ },
    { id: "special", label: "One special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ];

  const roles = [
    { id: "student", icon: <AcademicCapIcon className="h-8 w-8" />, label: "Student", description: "Access courses and learn" },
    { id: "instructor", icon: <UserGroupIcon className="h-8 w-8" />, label: "Instructor", description: "Teach and manage courses" },
    { id: "admin", icon: <ShieldCheckIcon className="h-8 w-8" />, label: "Admin", description: "Manage platform" },
  ];

  useEffect(() => {
    if (formData.password) {
      checkPasswordStrength(formData.password);
    } else {
      setPasswordStrength({
        score: 0,
        message: "Enter a password",
        color: "text-gray-500",
        progressColor: "bg-gray-300",
        requirements: {},
      });
    }
  }, [formData.password]);

  const checkPasswordStrength = (password) => {
    let score = 0;
    const reqStatus = {};
    requirements.forEach((req) => {
      const isMet = req.regex.test(password);
      reqStatus[req.id] = isMet;
      if (isMet) score++;
    });
    const strengthMap = [
      { message: "Very Weak", color: "text-red-600", progressColor: "bg-red-500" },
      { message: "Weak", color: "text-red-500", progressColor: "bg-red-500" },
      { message: "Fair", color: "text-yellow-600", progressColor: "bg-yellow-500" },
      { message: "Good", color: "text-green-500", progressColor: "bg-green-400" },
      { message: "Strong", color: "text-green-600", progressColor: "bg-green-500" },
      { message: "Very Strong", color: "text-green-700", progressColor: "bg-green-600" },
    ];
    setPasswordStrength({
      score,
      message: strengthMap[score].message,
      color: strengthMap[score].color,
      progressColor: strengthMap[score].progressColor,
      requirements: reqStatus,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (
        formData.password.length < 8 ||
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|:;"'<>,./`~\\]).{8,}$/.test(formData.password)
      ) {
        newErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
      } else if (passwordStrength.score < 3) {
        newErrors.password = "Please use a stronger password";
      }
      const commonPasswords = ["password123", "12345678", "qwerty123", "admin123", "password1"];
      if (commonPasswords.includes(formData.password.toLowerCase())) {
        newErrors.password = "This password is too common. Please choose a stronger one.";
      }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleGithubLogin = () => {
    loginWithRedirect({ authorizationParams: { connection: "github" } });
  };

  const handleGoogleLogin = () => {
    loginWithRedirect({ authorizationParams: { connection: "google-oauth2" } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allFields = ["name", "email", "password", "confirmPassword", "role"];
    const touchedFields = {};
    allFields.forEach((field) => (touchedFields[field] = true));
    setTouched(touchedFields);
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsLoading(true);
    const { confirmPassword, ...dataToSend } = formData;
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", dataToSend);
      alert(response.data.message || "Registration successful!");
      if (setUser) setUser(response.data.user);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data.errors) {
          const serverErrors = {};
          error.response.data.errors.forEach((err) => {
            serverErrors[err.field] = err.message;
          });
          setErrors(serverErrors);
        } else if (error.response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            email: "Email already registered. Please use a different email or login.",
          }));
        } else {
          alert("Server error. Please try again later.");
        }
      } else if (error.request) {
        alert("No response from server. Please check your connection.");
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full space-y-8"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Join thousands of learners worldwide</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Role Selection */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-xl h-fit"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Your Role</h3>
            <div className="space-y-4">
              {roles.map((roleItem) => (
                <motion.button
                  key={roleItem.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, role: roleItem.id })}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${formData.role === roleItem.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                    }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg ${formData.role === roleItem.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {roleItem.icon}
                    </div>
                    <div className="ml-4 text-left">
                      <div className="font-semibold text-gray-900">{roleItem.label}</div>
                      <div className="text-sm text-gray-600">{roleItem.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Register Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-2xl shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${touched.name && errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="John Doe"
                  />
                </div>
                {touched.name && errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${touched.email && errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="you@example.com"
                  />
                </div>
                {touched.email && errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${touched.phone && errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="+91 98765 43210"
                  />
                </div>
                {touched.phone && errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${touched.password && errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {touched.password && errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Password Strength</span>
                    <span className={`text-sm font-semibold ${passwordStrength.color}`}>{passwordStrength.message}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.progressColor}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {requirements.map((req) => (
                      <div key={req.id} className="flex items-center gap-2">
                        {passwordStrength.requirements[req.id] ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-gray-300" />
                        )}
                        <span className={`text-xs ${passwordStrength.requirements[req.id] ? "text-green-600" : "text-gray-500"}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${touched.confirmPassword && errors.confirmPassword ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <GithubLoginButton onClick={handleGithubLogin} />
                <GoogleLoginButton onClick={handleGoogleLogin} />
              </div>
            </div>

            {/* Login Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;