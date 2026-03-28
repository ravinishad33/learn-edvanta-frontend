import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Key,
  RefreshCw,
  ArrowLeft,
  Fingerprint,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
    color: "text-slate-400",
    progressColor: "bg-slate-300",
  });


 const apiUrl = import.meta.env.VITE_API_URL;



  const requirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "One uppercase letter", regex: /[A-Z]/ },
    { label: "One lowercase letter", regex: /[a-z]/ },
    { label: "One number", regex: /[0-9]/ },
    { label: "One special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ];

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired reset link");
      setTimeout(() => navigate("/forgot-password"), 2000);
    }
  }, [token, navigate]);

  const checkPasswordStrength = (password) => {
    let score = 0;
    requirements.forEach((req) => {
      if (req.regex.test(password)) score++;
    });

    const strengthMap = [
      { message: "Very Weak", color: "text-red-500", progressColor: "bg-red-500", width: "20%" },
      { message: "Weak Protocol", color: "text-rose-500", progressColor: "bg-rose-500", width: "40%" },
      { message: "Fair Entropy", color: "text-amber-500", progressColor: "bg-amber-500", width: "60%" },
      { message: "Good Security", color: "text-emerald-500", progressColor: "bg-emerald-400", width: "80%" },
      { message: "Strong Shield", color: "text-emerald-600", progressColor: "bg-emerald-500", width: "90%" },
      { message: "Maximum Defense", color: "text-indigo-600", progressColor: "bg-indigo-600", width: "100%" },
    ];

    const strength = strengthMap[score];
    setPasswordStrength({
      score,
      message: strength.message,
      color: strength.color,
      progressColor: strength.progressColor,
      width: strength.width
    });
  };

  const handlePasswordChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const errors = [];
    if (formData.newPassword.length < 8) errors.push("Password must be at least 8 characters");
    if (passwordStrength.score < 3) errors.push("Please use a stronger password");
    if (formData.newPassword !== formData.confirmPassword) errors.push("Passwords do not match");
    if (formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0) {
      const commonPasswords = ["password123", "12345678", "qwerty123"];
      if (commonPasswords.includes(formData.newPassword.toLowerCase())) {
        errors.push("This password is too common. Please choose a stronger one.");
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
    try {
      await axios.post(`${apiUrl}/api/auth/reset-password`, {
        email: contact,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/reset-success", {
          state: { email: contact, timestamp: new Date().toISOString() },
        });
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans antialiased relative overflow-hidden">
    
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-4xl relative">
        {/* Navigation Node */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/verify-otp")}
          className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 mb-8 transition-all"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:shadow-md">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em]">Verify Step</span>
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white flex flex-col lg:flex-row overflow-hidden min-h-[650px]"
        >
          {/* Left Sidebar - Theme Anchor */}
          <div className="lg:col-span-4 bg-slate-900 p-10 text-white flex flex-col justify-between lg:w-80 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%"><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
            </div>

            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-10 shadow-lg shadow-emerald-500/20">
                <Lock size={28} className="text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black block mb-2">Account Recovery</span>
              <h1 className="text-4xl font-black tracking-tight leading-none mb-6">
                New <br/>Security.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Update your account master-key. Use high-entropy characters to ensure full encryption of your Edvanta records.
              </p>
            </div>

            <div className="relative z-10 pt-10 border-t border-white/10 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Secure Node Active</span>
            </div>
          </div>

          {/* Right Section - Functional Area */}
          <div className="flex-1 p-8 sm:p-14 flex flex-col justify-center bg-white/50">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full space-y-8">
              
              {/* Diagnostic Password Strength UI */}
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] space-y-4 shadow-inner">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strength Diagnostic</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${passwordStrength.color}`}>{passwordStrength.message}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: passwordStrength.width }} 
                    className={`h-full transition-all duration-500 ${passwordStrength.progressColor}`} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {requirements.map((req, i) => {
                    const isMet = req.regex.test(formData.newPassword);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        {isMet ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-slate-300" />}
                        <span className={`text-[10px] font-bold ${isMet ? "text-slate-700" : "text-slate-400"}`}>{req.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Input Nodes */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative group">
                    <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => togglePasswordVisibility("newPassword")} 
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                      {showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => togglePasswordVisibility("confirmPassword")} 
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                      {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Transmission Block */}
              <button
                type="submit"
                disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Terminal size={18} />
                    Reset Password
                  </>
                )}
              </button>

              {/* Status Footer */}
              <div className="pt-8 border-t border-slate-100 text-center flex flex-col gap-2">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Target Account</span>
                <span className="text-[11px] font-bold text-slate-400 truncate">{contact || "Active Session User"}</span>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;