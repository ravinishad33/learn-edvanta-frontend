// pages/Register.jsx
import React, { useState, useEffect, useRef } from "react";
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
  KeyIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import GithubLoginButton from "../components/Auth/GithubLoginButton ";
import GoogleLoginButton from "../components/Auth/GoogleLoginButton ";
import toast from "react-hot-toast";



  const apiUrl = import.meta.env.VITE_API_URL;


const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // OTP input refs
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "Enter a password",
    color: "text-gray-500",
    progressColor: "bg-gray-300",
    requirements: {},
  });

  // Password requirements
  const requirements = [
    { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
    { id: "uppercase", label: "One uppercase letter", regex: /[A-Z]/ },
    { id: "lowercase", label: "One lowercase letter", regex: /[a-z]/ },
    { id: "number", label: "One number", regex: /[0-9]/ },
    {
      id: "special",
      label: "One special character",
      regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
  ];

  // Check password strength whenever password changes
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

  // OTP Timer countdown
  useEffect(() => {
    let interval;
    if (otpSent && !otpVerified && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer, otpVerified]);

  // Check password strength
  const checkPasswordStrength = (password) => {
    let score = 0;
    const reqStatus = {};

    requirements.forEach((req) => {
      const isMet = req.regex.test(password);
      reqStatus[req.id] = isMet;
      if (isMet) score++;
    });

    const strengthMap = [
      {
        message: "Very Weak",
        color: "text-red-600",
        progressColor: "bg-red-500",
      },
      { message: "Weak", color: "text-red-500", progressColor: "bg-red-500" },
      {
        message: "Fair",
        color: "text-yellow-600",
        progressColor: "bg-yellow-500",
      },
      {
        message: "Good",
        color: "text-green-500",
        progressColor: "bg-green-400",
      },
      {
        message: "Strong",
        color: "text-green-600",
        progressColor: "bg-green-500",
      },
      {
        message: "Very Strong",
        color: "text-green-700",
        progressColor: "bg-green-600",
      },
    ];

    setPasswordStrength({
      score,
      message: strengthMap[score].message,
      color: strengthMap[score].color,
      progressColor: strengthMap[score].progressColor,
      requirements: reqStatus,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional)
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (
        formData.password.length < 8 ||
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|:;"'<>,./`~\\]).{8,}$/.test(
          formData.password,
        )
      ) {
        newErrors.password =
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
      } else if (passwordStrength.score < 3) {
        newErrors.password = "Please use a stronger password";
      }

      // Check for common passwords
      const commonPasswords = [
        "password123",
        "12345678",
        "qwerty123",
        "admin123",
        "password1",
      ];
      if (commonPasswords.includes(formData.password.toLowerCase())) {
        newErrors.password =
          "This password is too common. Please choose a stronger one.";
      }
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle field blur (mark as touched)
  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };




  // Send OTP to email
  const handleSendOtp = async () => {
    if (!formData.email || !formData.email.includes("@")) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email first",
      }));
      return;
    }

    setOtpLoading(true);
    const toastId = toast.loading("Sending verification code...");

    try {
      const response = await axios.post(
        `${apiUrl}/api/otp/send-register-otp`,
        { email: formData.email }
      );

      // setTempUserId(response.data.tempUserId);
      setOtpSent(true);
      setOtpTimer(60);
      setCanResend(false);
      toast.success("Verification code sent to your email!", { id: toastId });
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send verification code",
        { id: toastId }
      );
    } finally {
      setOtpLoading(false);
    }
  };



  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit code");
      return;
    }

    setOtpLoading(true);
    const toastId = toast.loading("Verifying code...");

    try {
      const response = await axios.post(
        `${apiUrl}/api/otp/verify-register-otp`,
        {
          email: formData.email,
          otp: otpString,
          tempUserId,
        }
      );

      setOtpVerified(true);
      toast.success("Email verified successfully!", { id: toastId });
    } catch (error) {
      console.error("OTP verify error:", error);
      toast.error(
        error.response?.data?.message || "Invalid or expired code",
        { id: toastId }
      );
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      otpRefs[0].current.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setOtpLoading(true);
    const toastId = toast.loading("Resending verification code...");

    try {
      const response = await axios.post(
        `${apiUrl}/api/otp/send-register-otp`,
        { email: formData.email }
      );

      setOtpTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      toast.success("New verification code sent!", { id: toastId });
    } catch (error) {
      console.error("OTP resend error:", error);
      toast.error("Failed to resend code", { id: toastId });
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle social login
  const handleGithubLogin = () => {
    const toastId = toast.loading("Redirecting to GitHub...");
    try {
      loginWithRedirect({
        authorizationParams: {
          connection: "github",
        },
      });
      toast.success("Redirecting...", { id: toastId });
    } catch (error) {
      toast.error("GitHub login failed", { id: toastId });
      console.log("GitHub login error", error);
    }
  };

  const handleGoogleLogin = () => {
    const toastId = toast.loading("Redirecting to Google...");
    try {
      loginWithRedirect({
        authorizationParams: {
          connection: "google-oauth2",
        },
      });
      toast.success("Redirecting...", { id: toastId });
    } catch (error) {
      toast.error("Google login failed", { id: toastId });
      console.log("Google login error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      toast.error("Please verify your email first");
      return;
    }

    // Mark all fields as touched for validation
    const allFields = ["name", "email", "password", "confirmPassword", "role"];
    const touchedFields = {};
    allFields.forEach((field) => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    // Validate form
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...dataToSend } = formData;
    const toastId = toast.loading("Registering user...");
    
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/register`,
        { ...dataToSend, tempUserId }
      );

      toast.success(response.data.message || "Registration successful!", {
        id: toastId,
      });

      if (setUser) {
        setUser(response.data.user);
      }

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.errors) {
            const serverErrors = {};
            error.response.data.errors.forEach((err) => {
              serverErrors[err.field] = err.message;
            });
            setErrors(serverErrors);
          } else {
            toast.error(
              error.response.data.error ||
                error.response.data.message ||
                "Registration failed"
            );
          }
        } else if (error.response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            email:
              "Email already registered. Please use a different email or login.",
          }));
          toast.error(
            "Email already registered. Please use a different email or login."
          );
        } else {
          toast.error("Server error. Please try again later.");
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An error occurred. Please try again.");
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
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"
          >
            <AcademicCapIcon className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">Join thousands of learners worldwide</p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to join as:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["student", "instructor", "admin"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.role === role
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="capitalize font-medium">{role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.name && errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                  disabled={otpVerified}
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field with OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : otpVerified
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                  disabled={otpVerified}
                />
                {!otpVerified && !otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !formData.email}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {otpLoading ? "Sending..." : "Verify"}
                  </button>
                )}
                {otpVerified && (
                  <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* OTP Verification Section */}
            {otpSent && !otpVerified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-3">
                    Enter 6-digit verification code sent to {formData.email}
                  </label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        disabled={otpLoading}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otp.join("").length !== 6}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {otpLoading ? "Verifying..." : "Verify Code"}
                  </button>
                  
                  <div className="text-sm">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <span className="text-gray-500">
                        Resend in {otpTimer}s
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.phone && errors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Password Strength
                  </span>
                  <span
                    className={`text-sm font-semibold ${passwordStrength.color}`}
                  >
                    {passwordStrength.message}
                  </span>
                </div>

                {/* Strength Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.progressColor}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-1 gap-2">
                  {requirements.map((req) => (
                    <div key={req.id} className="flex items-center gap-2">
                      {passwordStrength.requirements[req.id] ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-gray-300" />
                      )}
                      <span
                        className={`text-sm ${
                          passwordStrength.requirements[req.id]
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
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
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !otpVerified}
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
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
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
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;