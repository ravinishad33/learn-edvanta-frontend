import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon, 
  ShieldExclamationIcon,
  PaperAirplaneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ContactSupport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Password Reset Issue',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Support request submitted! We\'ll contact you within 24 hours.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased flex flex-col items-center justify-center p-4 sm:p-6">
      
      {/* Back Button - Minimalist Style */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-4xl mb-6"
      >
        <button
          onClick={() => navigate('/forgot-password')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:shadow-md">
            <ArrowLeftIcon className="h-5 w-5" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Recovery</span>
        </button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl grid grid-cols-12 gap-8"
      >
        {/* Left Section: Context Card */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
             {/* Abstract Background Detail */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
                <ChatBubbleLeftRightIcon className="h-7 w-7 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter leading-tight mb-4">
                Customer <br/><span className="text-indigo-400">Support.</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Experiencing technical friction? Our elite support engineering team is ready to verify your identity and restore access.
              </p>
            </div>

            <div className="relative z-10 space-y-4 pt-10 border-t border-white/10">
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Live Support Active</span>
               </div>
               <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">
                 Average response time: <br/>
                 <span className="text-white">Under 24 Hours</span>
               </p>
            </div>
          </motion.div>
        </div>

        {/* Right Section: Form Card */}
        <div className="col-span-12 lg:col-span-8">
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-8 sm:p-12 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Identification Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                        placeholder="Enter Full Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                        placeholder="Enter Email..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Inquiry Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Inquiry Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-700 appearance-none cursor-pointer"
                  >
                    <option>Password Reset Issue</option>
                    <option>Account Access Problem</option>
                    <option>Suspicious Activity</option>
                    <option>Other Account Issue</option>
                  </select>
                </div>

                {/* Detailed Context */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Detailed Context</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="5"
                    placeholder="Describe your technical issue in detail..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 resize-none leading-relaxed"
                    required
                  />
                </div>

                {/* Security Briefing */}
                <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldExclamationIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-indigo-900 tracking-wider mb-1">Identity Verification</h4>
                    <p className="text-xs text-indigo-700 font-medium leading-relaxed italic">
                      "Please provide specific account details (e.g. last enrolled course) to expedite the security handshake."
                    </p>
                  </div>
                </div>

                {/* Transmission Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <PaperAirplaneIcon className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>

              {/* Direct Channels */}
              <div className="pt-8 border-t border-slate-100 text-center space-y-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Direct Administrative Node
                 </p>
                 <a href="mailto:support@edvanta.com" className="text-sm font-black text-indigo-600 hover:text-indigo-800 transition-all">
                    SUPPORT@EDVANTA.COM
                 </a>
              </div>

            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactSupport;