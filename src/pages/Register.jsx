import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Loader2 } from "lucide-react";
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
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|:;"'<>,./`~\\]).{8,}$/.test(
          formData.password,
        )
      ) {
        newErrors.password =
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
      } else if (passwordStrength.score < 3) {
        newErrors.password = "Please use a stronger password";
      }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

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
      const response = await axios.post(`${apiUrl}/api/otp/send-register-otp`, {
        email: formData.email,
      });

      setOtpSent(true);
      setOtpTimer(60);
      setCanResend(false);
      toast.success("Verification code sent to your email!", { id: toastId });
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send verification code",
        { id: toastId },
      );
    } finally {
      setOtpLoading(false);
    }
  };

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
        },
      );

      setOtpVerified(true);
      toast.success("Email verified successfully!", { id: toastId });
    } catch (error) {
      console.error("OTP verify error:", error);
      toast.error(error.response?.data?.message || "Invalid or expired code", {
        id: toastId,
      });
      setOtp(["", "", "", "", "", ""]);
      otpRefs[0].current.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);
    const toastId = toast.loading("Resending verification code...");

    try {
      const response = await axios.post(`${apiUrl}/api/otp/send-register-otp`, {
        email: formData.email,
      });

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

    const allFields = ["name", "email", "password", "confirmPassword", "role"];
    const touchedFields = {};
    allFields.forEach((field) => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);

    const { confirmPassword, ...dataToSend } = formData;
    const toastId = toast.loading("Registering user...");

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        ...dataToSend,
        tempUserId,
      });

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
                "Registration failed",
            );
          }
        } else if (error.response.status == 403) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            email:
              "Email already registered. Please use a different email or login.",
          }));
          toast.error(
            "Email already registered. Please use a different email or login.",
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
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FAF7FF] via-white to-[#E6E6FA] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-lg w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-4 sm:mb-6 shadow-lg shadow-[#B19CD9]/30 overflow-hidden"
          >
            <img
              src="Icon.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium px-4">
            Join thousands of learners worldwide
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl p-5 sm:p-8 md:p-10 rounded-[2rem] shadow-xl shadow-[#E6E6FA]/60 border border-white"
        >
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {["student", "instructor"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`relative p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 ease-out text-xs sm:text-sm font-bold ${
                      formData.role === role
                        ? "border-[#B19CD9] bg-[#FAF7FF] text-[#5E4B8A] shadow-sm transform scale-[1.02]"
                        : "border-gray-100 hover:border-[#D8BFD8] hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    <span className="capitalize block text-center w-full">
                      {role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#967BB6] transition-colors" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  className={`pl-11 w-full px-4 py-3 sm:py-3.5 bg-gray-50/50 border rounded-xl focus:bg-white focus:ring-4 focus:ring-[#E6E6FA] focus:border-[#B19CD9] transition-all outline-none text-sm sm:text-base ${
                    touched.name && errors.name
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  placeholder="Full Name"
                  disabled={otpVerified}
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field with OTP */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative group">
                <EnvelopeIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#967BB6] transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`pl-11 w-full px-4 py-3 sm:py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all text-sm sm:text-base ${
                    touched.email && errors.email
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10 focus:border-red-400"
                      : otpVerified
                        ? "border-green-400 bg-green-50/60 text-green-800"
                        : "border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#E6E6FA] focus:border-[#B19CD9]"
                  }`}
                  placeholder="Email Address"
                  disabled={otpVerified}
                />
                {!otpVerified && !otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !formData.email}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-[#967BB6] disabled:opacity-50 transition-colors"
                  >
                    {otpLoading ? "Sending..." : "Verify"}
                  </button>
                )}
                {otpVerified && (
                  <CheckCircleIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {touched.email && errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* OTP Verification Section */}
            <AnimatePresence>
              {otpSent && !otpVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 sm:p-5 bg-[#FAF7FF] rounded-2xl border border-[#E6E6FA] space-y-4"
                >
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#5E4B8A] mb-3 text-center sm:text-left">
                      Enter the 6-digit code sent to your email
                    </label>
                    <div className="flex justify-between gap-1 sm:gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={otpRefs[index]}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black text-[#5E4B8A] bg-white border-2 border-[#E6E6FA] rounded-xl focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50 transition-all outline-none disabled:opacity-50 shadow-sm"
                          disabled={otpLoading}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || otp.join("").length !== 6}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#967BB6] text-white text-sm font-bold rounded-xl hover:bg-[#7A589B] disabled:opacity-50 transition-colors shadow-md shadow-[#B19CD9]/30"
                    >
                      {otpLoading ? "Verifying..." : "Verify Code"}
                    </button>

                    <div className="text-xs sm:text-sm font-semibold">
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#7A589B] hover:text-[#5E4B8A] transition-colors"
                        >
                          Resend Code
                        </button>
                      ) : (
                        <span className="text-gray-500">
                          Resend in{" "}
                          <span className="text-[#967BB6]">{otpTimer}s</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number{" "}
                <span className="text-gray-400 font-medium">(Optional)</span>
              </label>
              <div className="relative group">
                <PhoneIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#967BB6] transition-colors" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  className={`pl-11 w-full px-4 py-3 sm:py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#E6E6FA] focus:border-[#B19CD9] text-sm sm:text-base ${
                    touched.phone && errors.phone
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  placeholder="+91 9678541254"
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative group">
                <LockClosedIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#967BB6] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`pl-11 pr-12 w-full px-4 py-3 sm:py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#E6E6FA] focus:border-[#B19CD9] text-sm sm:text-base ${
                    touched.password && errors.password
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-[#FAF7FF] transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            <AnimatePresence>
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex justify-between items-center px-1 mt-1">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Password Strength
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wide ${passwordStrength.color}`}
                    >
                      {passwordStrength.message}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ease-out rounded-full ${passwordStrength.progressColor}`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {requirements.map((req) => (
                      <div key={req.id} className="flex items-center gap-2">
                        {passwordStrength.requirements[req.id] ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-300 ml-1 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            passwordStrength.requirements[req.id]
                              ? "text-gray-700"
                              : "text-gray-400"
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative group">
                <LockClosedIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#967BB6] transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`pl-11 pr-12 w-full px-4 py-3 sm:py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#E6E6FA] focus:border-[#B19CD9] text-sm sm:text-base ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-[#FAF7FF] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-2 px-1">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 accent-[#967BB6] text-[#967BB6] focus:ring-[#B19CD9] border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3 text-xs sm:text-sm">
                <label htmlFor="terms" className="text-gray-600 font-semibold">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-[#7A589B] hover:text-[#5E4B8A] transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#7A589B] hover:text-[#5E4B8A] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !otpVerified}
              className="w-full bg-gradient-to-r from-[#B19CD9] to-[#967BB6] text-white py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base shadow-lg shadow-[#B19CD9]/30 hover:shadow-[#967BB6]/40 hover:from-[#A685E2] hover:to-[#8A63A6] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <GithubLoginButton
                  onClick={handleGithubLogin}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <GoogleLoginButton
                  onClick={handleGoogleLogin}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-500 font-semibold">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#7A589B] hover:text-[#5E4B8A] transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
