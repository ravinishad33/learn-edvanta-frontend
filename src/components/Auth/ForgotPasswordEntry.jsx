import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Shield,
  Key,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Smartphone,
  MailCheck,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const ForgotPasswordEntry = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [recoveryMethod, setRecoveryMethod] = useState("email"); // 'email' or 'phone'

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = `${recoveryMethod === "email" ? "Email" : "Phone number"} is required`;
    } else if (recoveryMethod === "email" && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (recoveryMethod === "phone" && !/^\+?[\d\s-]{10,}$/.test(email)) {
      newErrors.email = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const sendOTP = await axios.post(
        "http://localhost:5000/api/otp/send-otp",
        { email },
      );
      toast.success(sendOTP?.data?.message)
    
      // Mock API response
      //   const mockResponse = {
      //     success: true,
      //     message: recoveryMethod === 'email'
      //       ? 'Reset link sent to your email!'
      //       : 'OTP sent to your phone!',
      //     method: recoveryMethod,
      //     maskedContact: recoveryMethod === 'email'
      //       ? maskEmail(email)
      //       : maskPhoneNumber(email)
      //   };

      //   if (mockResponse.success) {
      //     toast.success(mockResponse.message);

      // Navigate to verification page with data
      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            contact: email,
            method: recoveryMethod,
            maskedContact: maskEmail(email),
          },
        });
      }, 1500);

      //   }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mask email for privacy
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    const maskedName =
      name.length > 2
        ? name.charAt(0) +
          "*".repeat(name.length - 2) +
          name.charAt(name.length - 1)
        : name.charAt(0) + "*";
    return `${maskedName}@${domain}`;
  };

  // Mask phone number for privacy
  const maskPhoneNumber = (phone) => {
    if (phone.length <= 4) return phone;
    const lastFour = phone.slice(-4);
    return "*******" + lastFour;
  };

  // Reset form
  const handleReset = () => {
    setEmail("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Login</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key size={40} />
            </div>
            <h1 className="text-3xl font-bold">Forgot Password?</h1>
            <p className="text-blue-100 mt-2">
              Don't worry! We'll help you reset your password
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Recovery Method Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you like to reset your password?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRecoveryMethod("email")}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    recoveryMethod === "email"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <Mail className="h-6 w-6" />
                  <span className="text-sm font-medium">Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecoveryMethod("phone")}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    recoveryMethod === "phone"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <Smartphone className="h-6 w-6" />
                  <span className="text-sm font-medium">Phone</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    {recoveryMethod === "email"
                      ? "Enter your registered email address"
                      : "Enter your registered phone number"}
                  </p>
                  <p className="text-xs text-blue-600">
                    {recoveryMethod === "email"
                      ? "We'll send a password reset link to your email inbox"
                      : "We'll send an OTP to your phone for verification"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {recoveryMethod === "email"
                    ? "Email Address"
                    : "Phone Number"}
                </label>
                <div className="relative">
                  {recoveryMethod === "email" ? (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  ) : (
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  )}
                  <input
                    type={recoveryMethod === "email" ? "email" : "tel"}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: "" });
                      }
                    }}
                    placeholder={
                      recoveryMethod === "email"
                        ? "you@example.com"
                        : "+1 (555) 123-4567"
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {recoveryMethod === "email"
                    ? "Enter the email associated with your account"
                    : "Enter your phone number with country code"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin h-5 w-5" />
                      Sending...
                    </>
                  ) : (
                    <>
                      {recoveryMethod === "email" ? (
                        <>
                          <MailCheck size={20} />
                          Send Reset Link
                        </>
                      ) : (
                        <>
                          <Smartphone size={20} />
                          Send OTP
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Other options
                  </span>
                </div>
              </div>
            </div>

            {/* Alternative Options */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Having trouble with the {recoveryMethod} method?
                </p>
                <button
                  onClick={() => {
                    setRecoveryMethod(
                      recoveryMethod === "email" ? "phone" : "email",
                    );
                    setEmail("");
                    setErrors({});
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Try {recoveryMethod === "email" ? "phone number" : "email"}{" "}
                  instead
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Don't have access to any registered contact method?
                </p>
                <button
                  onClick={() => navigate("/contact-support")}
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm underline"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Security Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Security Notice
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>
                    • We'll never ask for your password via email or phone
                  </li>
                  <li>• Reset links expire in 24 hours for security</li>
                  <li>• Always check the sender's email address</li>
                  <li>• Contact support if you notice suspicious activity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Back to Login
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@example.com"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>
    </div>
  );
};

export default ForgotPasswordEntry;
