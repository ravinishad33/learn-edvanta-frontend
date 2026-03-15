import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Key,
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Mail,
  Smartphone,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contact, method, maskedContact } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(120); // 2 minutes
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [error, setError] = useState("");
  //   console.log(contact)

  //   send otp api
  // http://localhost:5000/api/otp/send-otp
  // http://localhost:5000/api/otp/verify-otp

  // Start resend timer on component mount
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Auto-submit when all OTP digits are filled
  useEffect(() => {
    if (otp.every((digit) => digit !== "") && otp.length === 6) {
      handleSubmit();
    }
  }, [otp]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };





//   handle otp submit  verify otp
  const handleSubmit = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    if (verificationAttempts >= 3) {
      setError("Too many attempts. Please request a new code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/otp/verify-otp", {
        email: contact,
        otp: otpCode,
      });

    
      if (res.data.success) {
        toast.success("Code verified successfully!");

        setTimeout(() => {
          navigate("/reset-password", {
            state: {
              contact,
              method,
              token: "temp-token-" + Date.now(),
            },
          });
        }, 1000);
      }
    } catch (error) {
      setVerificationAttempts((prev) => prev + 1);

      const msg =
        error.response?.data?.message || "Invalid or expired verification code";

      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      // Simulate resend API call
        const sendOTP = await axios.post(
        "http://localhost:5000/api/otp/send-otp",
        { email:contact },
      );

      setOtp(["", "", "", "", "", ""]);
      setResendTimer(120);
      setError("");
      setVerificationAttempts(0);

      toast.success(`New code sent to ${maskedContact}`);
    } catch (error) {
      toast.error("Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Go back to email entry
  const handleGoBack = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key size={40} />
            </div>
            <h1 className="text-2xl font-bold">Enter Verification Code</h1>
            <p className="text-blue-100 mt-2">
              {method === "email"
                ? "Check your email for the code"
                : "Check your phone for the SMS"}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Contact Info */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                {method === "email" ? (
                  <Mail className="h-5 w-5 text-gray-500" />
                ) : (
                  <Smartphone className="h-5 w-5 text-gray-500" />
                )}
                <p className="text-gray-700 font-medium">
                  Code sent to{" "}
                  <span className="font-bold">{maskedContact || contact}</span>
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Enter the 6-digit verification code we sent to verify your
                identity
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-8">
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && index > 0) {
                        document.getElementById(`otp-${index - 1}`).focus();
                      }
                    }}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-center">
                  <p className="text-sm text-red-600 flex items-center justify-center gap-1">
                    <AlertCircle size={14} />
                    {error}
                  </p>
                </div>
              )}

              {/* Attempts Counter */}
              {verificationAttempts > 0 && (
                <div className="text-center mt-2">
                  <p className="text-xs text-gray-500">
                    Attempts: {verificationAttempts}/3
                  </p>
                </div>
              )}
            </div>

            {/* Timer and Resend */}
            <div className="text-center mb-8">
              {resendTimer > 0 ? (
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Resend code in{" "}
                    <span className="font-semibold">
                      {formatTime(resendTimer)}
                    </span>
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading  }
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Didn't receive code? Resend
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || otp.some((digit) => digit === "")}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold mb-4"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Verify & Continue
                </>
              )}
            </button>

            {/* Manual Submit Hint */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                The form will auto-submit when all digits are entered
              </p>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 p-6 border-t border-blue-100">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Keep Your Account Secure
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Never share verification codes with anyone</li>
                  <li>• Codes expire in 15 minutes for security</li>
                  <li>• Use a strong, unique password for your account</li>
                  <li>• Enable two-factor authentication if available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble?{" "}
            <button
              onClick={() => navigate("/contact-support")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
