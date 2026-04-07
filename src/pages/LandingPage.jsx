// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  AcademicCapIcon, BookOpenIcon, UserGroupIcon,
  PlayCircleIcon, ArrowRightIcon, SparklesIcon,
  BoltIcon, CodeBracketIcon, VideoCameraIcon, TrophyIcon,
  RocketLaunchIcon, GlobeAltIcon, PaintBrushIcon,
  CheckCircleIcon, CpuChipIcon, CommandLineIcon,
  LightBulbIcon, StarIcon, BookmarkIcon
} from '@heroicons/react/24/outline';
import { Loader2 } from "lucide-react";
import NewCoursesCounter from "../components/Layout/NewCoursesCounter";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const apiUrl = import.meta.env.VITE_API_URL;

  // Stats state including the fix for newlyAddedCount
  const [stats, setStats] = useState({
    students: 1200,
    courses: 150,
    instructors: 45,
    certificates: 850,
    newlyAddedCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!apiUrl) return;
        const { data } = await axios.get(`${apiUrl}/api/public/platform-stats`);
        if (data.success && data.data) {
          setStats({
            ...data.data,
            newlyAddedCount: data.data.newCoursesCount || 0
          });
        }
      } catch (error) {
        console.error("Landing page stats fetch failed", error);
      }
    };
    fetchStats();
  }, [apiUrl]);

  const fadeInUp = { 
    initial: { opacity: 0, y: 25 }, 
    whileInView: { opacity: 1, y: 0 }, 
    viewport: { once: true }, 
    transition: { duration: 0.6 } 
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] font-sans selection:bg-[#B19CD9] selection:text-white overflow-x-hidden">
      {/* Top Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 z-[100] bg-gradient-to-r from-[#B19CD9] via-[#967BB6] to-[#7A589B] origin-left" 
        style={{ scaleX: smoothProgress }} 
      />

      {/* --- UNIQUE ASYMMETRIC HERO --- */}
      <section className="relative pt-10 lg:pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-white rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-[#E6E6FA]/60 border border-white overflow-hidden">
            
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#E6E6FA]/40 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#B19CD9]/10 rounded-full blur-[80px]" />

            <div className="grid lg:grid-cols-12 gap-12 relative z-10">
              {/* Left Side: Headline */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-4 mb-8">
                  <motion.div whileHover={{ rotate: 10 }} className="p-1 bg-[#FAF7FF] rounded-2xl shadow-md border border-[#E6E6FA]">
                    <img src="Icon.png" alt="Logo" className="w-14 h-14 rounded-xl" />
                  </motion.div>
                  {stats.newlyAddedCount > 0 && (
                    <div className="bg-[#E6E6FA] text-[#5E4B8A] px-4 py-1.5 rounded-full text-xs font-black border border-white shadow-sm flex items-center gap-2">
                       <SparklesIcon className="w-4 h-4 text-[#967BB6]" />
                       <NewCoursesCounter newlyAddedCount={stats.newlyAddedCount} />
                    </div>
                  )}
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1A1A2E] leading-[0.95] tracking-tighter mb-8">
                  Future-Proof <br /> 
                  <span className="italic font-serif font-light text-[#967BB6]">Your Genius.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg font-medium leading-relaxed">
                  The world's most intuitive platform for tech education. Master industry standards with guided precision.
                </p>

                <div className="flex flex-wrap gap-5">
                  <Link to={isLoggedIn ? "/courses" : "/register"} className="px-10 py-5 bg-[#1A1A2E] text-white font-bold rounded-2xl hover:bg-[#7A589B] shadow-xl transition-all duration-300 transform active:scale-95">
                    {isLoggedIn ? "Resume Learning" : "Start For Free"}
                  </Link>
                  <Link to="/courses" className="px-10 py-5 bg-white text-[#1A1A2E] font-bold rounded-2xl border-2 border-[#E6E6FA] hover:border-[#B19CD9] transition-all flex items-center gap-2 group">
                    Explore Catalog <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Side: Floating UI Elements (The Attractive Part) */}
              <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center">
                 {/* Main Decorative Card */}
                 <motion.div 
                   animate={{ y: [0, -15, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="w-full max-w-[320px] bg-white p-6 rounded-[2.5rem] shadow-[0_40px_80px_rgba(150,123,182,0.2)] border border-[#FAF7FF] rotate-3 relative z-20"
                 >
                    <div className="h-40 rounded-[2rem] bg-gradient-to-br from-[#E6E6FA] to-[#FAF7FF] mb-6 flex items-center justify-center">
                       <PlayCircleIcon className="w-16 h-16 text-[#B19CD9]" />
                    </div>
                    <div className="space-y-3">
                       <div className="h-2 w-1/3 bg-gray-100 rounded-full" />
                       <div className="h-5 w-full bg-gray-50 rounded-lg" />
                       <div className="flex gap-2 pt-2">
                          <div className="w-6 h-6 rounded-full bg-[#B19CD9]/20" />
                          <div className="w-6 h-6 rounded-full bg-[#B19CD9]/20" />
                       </div>
                    </div>
                 </motion.div>

                 {/* Floating Badges */}
                 <motion.div 
                    animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute top-0 right-0 bg-[#FAF7FF] p-5 rounded-3xl shadow-xl border border-white z-30 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-inner">
                       <StarIcon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                       <p className="text-xs font-black text-gray-400 uppercase">Top Rated</p>
                       <p className="text-sm font-bold text-gray-900">Expert Choice</p>
                    </div>
                 </motion.div>

                 <motion.div 
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    className="absolute -bottom-5 -left-10 bg-[#1A1A2E] p-6 rounded-[2rem] shadow-2xl text-white z-10"
                  >
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white/10 rounded-lg"><CpuChipIcon className="w-6 h-6 text-[#B19CD9]" /></div>
                       <div>
                          <p className="text-[10px] font-bold text-gray-400">ENROLLED</p>
                          <p className="text-base font-black">AI & Web Dev</p>
                       </div>
                    </div>
                 </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODERN STATS BAR --- */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Students", val: stats.students, icon: UserGroupIcon },
            { label: "Courses", val: stats.courses, icon: BookOpenIcon },
            { label: "Instructors", val: stats.instructors, icon: AcademicCapIcon },
            { label: "Verified", val: stats.certificates, icon: TrophyIcon }
          ].map((s, i) => (
            <div key={i} className="group p-6 rounded-[2rem] bg-white border border-[#E6E6FA] flex items-center gap-4 transition-all hover:shadow-lg">
               <div className="w-12 h-12 rounded-xl bg-[#FAF7FF] flex items-center justify-center text-[#967BB6] group-hover:bg-[#B19CD9] group-hover:text-white transition-colors shadow-inner">
                  <s.icon className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-xl sm:text-2xl font-black text-[#1A1A2E]">{(s.val || 0).toLocaleString()}+</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-6xl font-black text-[#1A1A2E] leading-tight">
                Designed for the <br />
                <span className="text-[#967BB6]">High Performer.</span>
              </h2>
            </div>
            <p className="text-gray-500 font-medium max-w-sm">We don't just provide courses; we provide a career-accelerating experience through a tailored Lavender ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Box 1 - Big Feature */}
            <motion.div {...fadeInUp} className="md:col-span-2 md:row-span-2 rounded-[3rem] bg-[#E6E6FA]/40 border border-white p-10 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <RocketLaunchIcon className="w-64 h-64 text-[#967BB6]" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-8">
                   <BoltIcon className="w-8 h-8 text-[#967BB6]" />
                </div>
                <h3 className="text-3xl font-black text-[#1A1A2E] mb-4">Fast-Track Curriculum</h3>
                <p className="text-gray-600 max-w-sm text-lg font-medium leading-relaxed">
                  Our courses are optimized for speed and retention. Learn in weeks, not months.
                </p>
              </div>
              <div className="mt-auto relative z-10 flex gap-4">
                 <div className="px-6 py-2 bg-white rounded-full text-sm font-bold text-[#5E4B8A] shadow-sm">Industry Projects</div>
                 <div className="px-6 py-2 bg-white rounded-full text-sm font-bold text-[#5E4B8A] shadow-sm">Live Codes</div>
              </div>
            </motion.div>

            {/* Box 2 */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="rounded-[3rem] bg-white border border-[#E6E6FA] p-8 flex flex-col hover:shadow-xl transition-all">
               <div className="w-12 h-12 rounded-xl bg-[#FAF7FF] flex items-center justify-center mb-6">
                  <UserGroupIcon className="w-6 h-6 text-[#967BB6]" />
               </div>
               <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Mentor Network</h3>
               <p className="text-gray-500 text-sm font-medium">Direct access to professionals from the world's leading tech companies.</p>
            </motion.div>

            {/* Box 3 */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="rounded-[3rem] bg-[#1A1A2E] p-8 flex flex-col text-white shadow-2xl">
               <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <TrophyIcon className="w-6 h-6 text-[#B19CD9]" />
               </div>
               <h3 className="text-xl font-bold mb-2">Verified Success</h3>
               <p className="text-gray-400 text-sm font-medium">Industry-standard certificates to validate your professional journey.</p>
            </motion.div>
          </div>
        </div>
      </section>

  


    </div>
  );
};

export default LandingPage;