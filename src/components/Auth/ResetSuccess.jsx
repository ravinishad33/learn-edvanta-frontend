import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  LogIn,
  Home,
  ShieldCheck,
  Mail,
  Clock,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ResetSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, timestamp } = location.state || {};

  const [countdown, setCountdown] = useState(5);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const securityTips = [
    "Update your details regularly",
    "Use a password manager",
    "Check your account activity",
    "Do not share your tokens",
  ];

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
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/login');
    }
  }, [countdown, navigate]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % securityTips.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

  const formatDate = (isoString) => {
    const date = isoString ? new Date(isoString) : new Date();
    return (
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }) +
      " " +
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans antialiased relative overflow-hidden">
        {/* Background Glows matching Dashboard */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-4xl relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white flex flex-col lg:flex-row overflow-hidden min-h-[600px]"
        >
          {/* Left Sidebar - Success Branding */}
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
              <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-10 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black block mb-2">
                Final Step
              </span>
              <h1 className="text-4xl font-black tracking-tight leading-none mb-6">
                Password <br />
                Updated.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Your administrative credentials have been successfully
                re-encrypted and stored in the Edvanta security cluster.
              </p>
            </div>

            <div className="relative z-10 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Identity Secure
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Success Workspace */}
          <div className="flex-1 p-8 sm:p-14 flex flex-col justify-center bg-white/50">
            <div className="max-w-md mx-auto w-full space-y-10">
              {/* Central Success Node */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="relative inline-block"
                >
                  <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-100">
                    <Zap
                      size={40}
                      className="text-emerald-600 fill-emerald-600"
                    />
                  </div>
                  <div className="absolute inset-0 bg-emerald-400 rounded-[2rem] animate-ping opacity-10" />
                </motion.div>

                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  System Ready.
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Your new security handshake is active. Proceed to the
                  authentication portal to resume your session.
                </p>
              </div>

              {/* Data Audit Logs */}
              <div className="grid grid-cols-1 gap-4">
                <AuditItem
                  icon={Mail}
                  label="Target Identity"
                  value={email || "Active User"}
                />
                <AuditItem
                  icon={Clock}
                  label="Timestamp"
                  value={formatDate(timestamp)}
                />
              </div>

              {/* Dynamic Security Briefing */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Security Tip
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTipIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm font-bold leading-relaxed pr-4"
                  >
                    {securityTips[currentTipIndex]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex gap-1.5 mt-4">
                  {securityTips.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${i === currentTipIndex ? "w-4 bg-emerald-400" : "w-1 bg-slate-700"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Action Node */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full group bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <LogIn size={18} />
                  Navigate to Login
                </button>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-slate-100 border-t-emerald-500 animate-spin" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Auto-Redirect in {countdown}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* --- Atomic Components --- */
const AuditItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
      <Icon size={18} className="text-slate-400" />
    </div>
    <div className="min-w-0">
      <p className="text-[9px] uppercase font-black text-slate-400 tracking-tight">
        {label}
      </p>
      <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
    </div>
  </div>
);

export default ResetSuccess;
