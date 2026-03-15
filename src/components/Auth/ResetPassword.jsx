import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Key,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, contact } = location.state || {};

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);


  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "Very Weak",
    color: "text-gray-500",
    progressColor: "bg-gray-300",
  });

  // Password requirements
  const requirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "One uppercase letter", regex: /[A-Z]/ },
    { label: "One lowercase letter", regex: /[a-z]/ },
    { label: "One number", regex: /[0-9]/ },
    { label: "One special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ];


  // not implementented yet 
  // Check if token exists
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired reset link");
      setTimeout(() => navigate("/forgot-password"), 2000);
    }
  }, [token, navigate]);

  // Check password strength
  const checkPasswordStrength = (password) => {
    let score = 0;
    requirements.forEach((req) => {
      if (req.regex.test(password)) score++;
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

    const strength = strengthMap[score];
    setPasswordStrength({
      score,
      message: strength.message,
      color: strength.color,
      progressColor: strength.progressColor,
    });
  };

  // Handle password change
  const handlePasswordChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = [];

    if (formData.newPassword.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (passwordStrength.score < 3) {
      errors.push("Please use a stronger password");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length > 0
    ) {
      // Check if password matches common patterns
      const commonPasswords = ["password123", "12345678", "qwerty123"];
      if (commonPasswords.includes(formData.newPassword.toLowerCase())) {
        errors.push(
          "This password is too common. Please choose a stronger one.",
        );
      }
    }

    return errors;
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = validateForm();
  if (errors.length > 0) {
    errors.forEach((error) => toast.error(error));
    return;
  }

  setIsLoading(true);
  console.log(contact,formData)
  try {
    const res=await axios.post(
      "http://localhost:5000/api/auth/reset-password",
      {
        email: contact,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }
    );

  // console.log(res)

    toast.success("Password reset successfully!");

    setTimeout(() => {
      navigate("/reset-success", {
        state: {
          email: contact,
          timestamp: new Date().toISOString(),
        },
      });
    }, 1500);

  } catch (error) {
    console.error("Reset password error:", error.response?.data || error);
    toast.error(
      error.response?.data?.message ||
      "Failed to reset password. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};


  // Go back to OTP verification
  const handleGoBack = () => {
    navigate("/verify-otp");
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
          <span className="font-medium">Back to Verification</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key size={40} />
            </div>
            <h1 className="text-3xl font-bold">Create New Password</h1>
            <p className="text-green-100 mt-2">
              Create a strong, unique password for your account
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Security Indicator */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Secure Password Reset
                  </p>
                  <p className="text-xs text-green-700">
                    Your session is secure and encrypted
                  </p>
                </div>
              </div>
            </div>

            {/* Password Strength */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
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
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.progressColor}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                {requirements.map((req, index) => {
                  const isMet = req.regex.test(formData.newPassword);
                  return (
                    <div key={index} className="flex items-center gap-2">
                      {isMet ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300" />
                      )}
                      <span
                        className={`text-sm ${isMet ? "text-green-600" : "text-gray-500"}`}
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.newPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formData.confirmPassword &&
                      formData.newPassword !== formData.confirmPassword
                        ? "border-red-300"
                        : formData.confirmPassword &&
                            formData.newPassword === formData.confirmPassword
                          ? "border-green-300"
                          : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {formData.newPassword === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password Tips */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  💡 Password Tips
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use a mix of letters, numbers, and symbols</li>
                  <li>• Avoid personal information (birthdays, names)</li>
                  <li>• Consider using a passphrase instead of a password</li>
                  <li>
                    • Use a password manager to generate and store strong
                    passwords
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.newPassword ||
                  !formData.confirmPassword
                }
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-md"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin h-5 w-5" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Reset Password
                  </>
                )}
              </button>
            </form>

            {/* Session Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Secure session for:{" "}
                  <span className="font-medium">
                    {contact || "Your account"}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Token expires in: 15 minutes
                </p>
              </div>
            </div>
          </div>

          {/* Security Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Important Security Notes
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Always log out from shared devices</li>
                  <li>• Use different passwords for different accounts</li>
                  <li>• Enable two-factor authentication for added security</li>
                  <li>• Regularly update your passwords (every 3-6 months)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having issues?{" "}
            <button
              onClick={() => navigate("/contact-support")}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
