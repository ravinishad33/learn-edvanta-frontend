import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Key,
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Mail,
  Smartphone,
  Fingerprint,
  Lock,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contact, method, maskedContact } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (otp.every((digit) => digit !== "") && otp.length === 6) {
      handleSubmit();
    }
  }, [otp]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    if (verificationAttempts >= 3) {
      setError("Maximum attempts reached. Request a new code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${apiUrl}/api/otp/verify-otp`, {
        email: contact,
        otp: otpCode,
      });

      if (res.data.success) {
        toast.success("Identity Authenticated");
        setTimeout(() => {
          navigate("/reset-password", {
            state: { contact, method, token: "secure-auth-" + Date.now() },
          });
        }, 1000);
      }
    } catch (error) {
      setVerificationAttempts((prev) => prev + 1);
      const msg = error.response?.data?.message || "Verification Failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      await axios.post(`${apiUrl}/api/otp/send-otp`, { email: contact });
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(120);
      setError("");
      setVerificationAttempts(0);
      toast.success(`Encrypted code resent to endpoint`);
    } catch (error) {
      toast.error("Handshake Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans antialiased relative overflow-hidden">
      {/* Theme-Consistent Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-4xl relative">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/forgot-password")}
          className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 mb-8 transition-all"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:shadow-md">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em]">Return to Recovery</span>
        </motion.button>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white flex flex-col lg:flex-row overflow-hidden min-h-[600px]"
        >
          {/* Left Sidebar - Administrative Style */}
          <div className="lg:col-span-4 bg-slate-900 p-10 text-white flex flex-col justify-between lg:w-80 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <svg width="100%" height="100%"><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
            </div>

            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500 flex items-center justify-center mb-10 shadow-lg shadow-indigo-500/20">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-black block mb-2">Auth Module</span>
              <h1 className="text-4xl font-black tracking-tight leading-none mb-6">
                Identity <br/>Check.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                We sent a code to your registered contact.
              </p>
            </div>

            <div className="relative z-10 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Handshake Pending</span>
              </div>
            </div>
          </div>

          {/* Right Section - Input Workspace */}
          <div className="flex-1 p-8 sm:p-14 flex flex-col justify-center bg-white/50">
            <div className="max-w-md mx-auto w-full space-y-10">
              
              {/* Recipient Indicator */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                  {method === "email" ? <Mail size={14} className="text-slate-500"/> : <Smartphone size={14} className="text-slate-500"/>}
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">{maskedContact || contact}</span>
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Enter OTP</h2>
                <p className="text-xs text-slate-400 font-medium">Validation requires a 6-digit access code.</p>
              </div>

              {/* OTP Input Nodes */}
              <div className="space-y-6">
                <div className="flex justify-between gap-2 sm:gap-4">
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
                      className="w-full h-14 sm:h-16 text-center text-2xl font-black bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-800 shadow-sm"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-red-500 bg-red-50/50 py-2 rounded-xl border border-red-100">
                      <AlertCircle size={14} className="font-bold" />
                      <span className="text-[11px] font-black uppercase tracking-wider">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Interaction Block */}
              <div className="space-y-6">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || otp.some((d) => d === "")}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="animate-spin h-5 w-5" /> : <> <Fingerprint size={18}/> Authenticate </>}
                </button>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-300" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {resendTimer > 0 ? `Reset allowed in ${formatTime(resendTimer)}` : "Request reset available"}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${resendTimer > 0 ? "text-slate-300 cursor-not-allowed" : "text-indigo-600 hover:text-indigo-800 underline decoration-2 underline-offset-4"}`}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              {/* Troubleshooting Footer */}
              <div className="pt-8 border-t border-slate-100 text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                   Verification experiencing delays? <br/>
                   <button onClick={() => navigate("/contact-support")} className="text-indigo-600 hover:underline">Connect with System Admin</button>
                 </p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;