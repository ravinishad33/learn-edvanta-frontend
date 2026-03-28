import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  ShieldAlert,
  Key,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Smartphone,
  CheckCircle2,
  Fingerprint,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ForgotPasswordEntry = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [recoveryMethod, setRecoveryMethod] = useState("email");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/otp/send-otp`, {
        email,
      });
      toast.success(response?.data?.message || "OTP Sent Successfully");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            contact: email,
            method: recoveryMethod,
            maskedContact:
              recoveryMethod === "email"
                ? maskEmail(email)
                : maskPhoneNumber(email),
          },
        });
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Server connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return name.length > 2
      ? `${name[0]}***${name[name.length - 1]}@${domain}`
      : `*@${domain}`;
  };

  const maskPhoneNumber = (phone) =>
    phone.length <= 4 ? phone : "*******" + phone.slice(-4);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans antialiased relative overflow-hidden">
          {/* Background Glows matching Admin Theme */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-4xl relative">
        {/* Navigation Node */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/login")}
          className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 mb-8 transition-all"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:shadow-md">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Return to Portal
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white flex flex-col lg:flex-row overflow-hidden min-h-[600px]"
        >
          {/* Left Sidebar - Security Branding */}
          <div className="lg:col-span-4 bg-slate-900 p-10 text-white flex flex-col justify-between lg:w-80 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern
                  id="grid"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 24 0 L 0 0 0 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500 flex items-center justify-center mb-10 shadow-lg shadow-indigo-500/20">
                <Key size={28} className="text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-black block mb-2">
                Security Module
              </span>
              <h1 className="text-4xl font-black tracking-tight leading-none mb-6">
                Password <br />
                Recovery.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Our multi-factor authentication layer ensures your educational
                credentials remain strictly under your control.
              </p>
            </div>

            <div className="relative z-10 pt-10 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Fingerprint size={16} className="text-indigo-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Identity Shield
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Form Area */}
          <div className="flex-1 p-8 sm:p-14 flex flex-col justify-center bg-white/50">
            <form
              onSubmit={handleSubmit}
              className="space-y-8 max-w-lg mx-auto w-full"
            >
              {/* Method Selection Tiles */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Authentication Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <MethodTile
                    active={recoveryMethod === "email"}
                    onClick={() => {
                      setRecoveryMethod("email");
                      setEmail("");
                    }}
                    icon={Mail}
                    label="Email Inbox"
                  />
                  <MethodTile
                    active={recoveryMethod === "phone"}
                    onClick={() => {
                      setRecoveryMethod("phone");
                      setEmail("");
                    }}
                    icon={Smartphone}
                    label="SMS Device"
                  />
                </div>
              </div>

              {/* Input Node */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {recoveryMethod === "email"
                    ? "Registered Email"
                    : "Registered Mobile"}
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                    {recoveryMethod === "email" ? (
                      <Mail size={20} />
                    ) : (
                      <Smartphone size={20} />
                    )}
                  </div>
                  <input
                    type={recoveryMethod === "email" ? "email" : "tel"}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder={
                      recoveryMethod === "email"
                        ? "Enter Email..."
                        : "+91 ••••• •••••"
                    }
                    className={`w-full pl-14 pr-6 py-5 bg-slate-50 border rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700 ${errors.email ? "border-red-200 bg-red-50/30" : "border-slate-100"}`}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-[11px] font-bold text-red-500 flex items-center gap-1.5 mt-2 ml-1"
                    >
                      <AlertCircle size={14} /> {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Transmission Block */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setErrors({});
                  }}
                  className="px-6 py-5 border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  <RefreshCw size={20} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Fingerprint size={18} />
                      Send OTP
                    </>
                  )}
                </button>
              </div>

              {/* Secondary Navigation */}
              <div className="pt-10 border-t border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-400">
                  Having issues?{" "}
                  <button
                    onClick={() => navigate("/contact-support")}
                    className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4"
                  >
                    Contact Support
                  </button>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* --- Atomic Components --- */

const MethodTile = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group ${
      active
        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-lg shadow-indigo-100"
        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
    }`}
  >
    <Icon
      className={`h-6 w-6 transition-transform ${active ? "scale-110" : "group-hover:scale-110"}`}
    />
    <span className="text-[10px] font-black uppercase tracking-widest">
      {label}
    </span>
  </button>
);

export default ForgotPasswordEntry;
