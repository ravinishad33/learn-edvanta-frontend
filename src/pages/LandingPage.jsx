// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  AcademicCapIcon, BookOpenIcon, ChartBarIcon, UserGroupIcon,
  PlayCircleIcon, ArrowRightIcon, SparklesIcon,
  BoltIcon, CodeBracketIcon, VideoCameraIcon, TrophyIcon,
  RocketLaunchIcon, GlobeAltIcon, PaintBrushIcon,
  CheckCircleIcon, CpuChipIcon, CommandLineIcon, CalculatorIcon,
  LightBulbIcon, DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const heroY = useTransform(smoothProgress, [0, 0.5], [0, 100]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

  const apiUrl = import.meta.env.VITE_API_URL;

  // State for real-time stats
  const [stats, setStats] = useState({
    students: 1200,
    courses: 150,
    instructors: 45,
    certificates: 850,
  });

  // Fetch real data on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!apiUrl) return;
        const { data } = await axios.get(`${apiUrl}/api/public/platform-stats`);
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Landing page stats fetch failed", error);
      }
    };
    fetchStats();
  }, [apiUrl]);

  const features = [
    { icon: AcademicCapIcon, title: "Expert Instructors", desc: "Learn from industry leaders at top tech companies", stats: `${stats.instructors}+ Instructors`, gradient: "from-blue-500 to-cyan-400" },
    { icon: VideoCameraIcon, title: "Live Sessions", desc: "Interactive classes with real-time doubt clearing", stats: "Daily Live", gradient: "from-green-500 to-emerald-400" },
    { icon: TrophyIcon, title: "Certified Learning", desc: "Industry-recognized certificates for your career", stats: "Verified Certs", gradient: "from-orange-500 to-amber-400" }
  ];

  const floatingIcons = [
    { Icon: CodeBracketIcon, color: "text-blue-500", delay: 0, x: "8%", y: "15%", size: "w-12 h-12" },
    { Icon: PaintBrushIcon, color: "text-purple-500", delay: 0.5, x: "88%", y: "20%", size: "w-14 h-14" },
    { Icon: CpuChipIcon, color: "text-green-500", delay: 1, x: "12%", y: "75%", size: "w-10 h-10" },
    { Icon: CalculatorIcon, color: "text-orange-500", delay: 1.5, x: "85%", y: "70%", size: "w-12 h-12" },
    { Icon: CommandLineIcon, color: "text-pink-500", delay: 2, x: "50%", y: "8%", size: "w-16 h-16" },
    { Icon: GlobeAltIcon, color: "text-cyan-500", delay: 2.5, x: "92%", y: "45%", size: "w-10 h-10" },
    { Icon: LightBulbIcon, color: "text-yellow-500", delay: 3, x: "5%", y: "45%", size: "w-14 h-14" },
    { Icon: DevicePhoneMobileIcon, color: "text-indigo-500", delay: 3.5, x: "75%", y: "85%", size: "w-12 h-12" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveFeature((p) => (p + 1) % 4), 4000);
    return () => clearInterval(timer);
  }, []);

  const fadeInUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } };

  return (
    <div className="relative bg-white overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 z-50 origin-left" style={{ scaleX: smoothProgress }} />

      {/* Hero - Light Theme with Multiple Icons */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]" />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-purple-200/50 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 12, repeat: Infinity, delay: 4 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-3xl" />
        </div>

        {/* Multiple Floating Icons */}
        {floatingIcons.map(({ Icon, color, delay, x, y, size }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.3, 
              scale: 1,
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              opacity: { delay: delay, duration: 0.6 },
              scale: { delay: delay, duration: 0.6 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ left: x, top: y }}
            className={`absolute ${color} hidden lg:block ${size}`}
          >
            <Icon className="w-full h-full" />
          </motion.div>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 text-center pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg border border-blue-100 mb-8">
            <SparklesIcon className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">Trusted by {(stats?.students || 0).toLocaleString()}+ learners worldwide</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
            Master Skills
            <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Without Limits</span>
              <motion.svg initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="absolute -bottom-4 left-0 w-full h-6 text-purple-300" viewBox="0 0 400 20" preserveAspectRatio="none">
                <motion.path d="M0,10 Q100,0 200,10 T400,10" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the next generation of learners. Access {(stats?.courses || 0).toLocaleString()}+ expert-led courses, build real-world projects, and accelerate your career.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isLoggedIn ? (
              <Link to={`/${user?.role}-dashboard`} className="group inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 hover:scale-105 shadow-2xl transition-all">
                Continue Learning <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-2xl shadow-purple-500/30 transition-all">
                  <RocketLaunchIcon className="mr-2 h-5 w-5" /> Start Free Trial <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                </Link>
                <Link to="/courses" className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-full border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:scale-105 transition-all">
                  <PlayCircleIcon className="mr-2 h-5 w-5 text-blue-600" /> Watch Demo
                </Link>
              </>
            )}
          </motion.div>

          {/* Enhanced Dynamic Stats with Icons */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { v: `${(stats?.students || 0).toLocaleString()}+`, l: "Active Learners", i: UserGroupIcon, c: "text-blue-600", bg: "bg-blue-50" },
              { v: `${(stats?.courses || 0).toLocaleString()}+`, l: "Expert Courses", i: BookOpenIcon, c: "text-purple-600", bg: "bg-purple-50" },
              { v: `${(stats?.instructors || 0).toLocaleString()}+`, l: "Expert Instructors", i: AcademicCapIcon, c: "text-green-600", bg: "bg-green-50" },
              { v: `${(stats?.certificates || 0).toLocaleString()}+`, l: "Certificates Earned", i: TrophyIcon, c: "text-amber-500", bg: "bg-amber-50" }
            ].map((s, i) => {
              const Icon = s.i;
              return (
                <motion.div key={i} whileHover={{ scale: 1.08, y: -8 }} transition={{ type: "spring", stiffness: 300 }} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300">
                    <div className={`${s.bg} ${s.c} w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{s.v}</div>
                    <div className="text-sm text-gray-500 font-medium">{s.l}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <span className="text-sm font-medium">Featured in:</span>
            {['Forbes India', 'YourStory', 'TechCrunch', 'Inc42'].map((b, i) => <span key={i} className="text-lg font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-default">{b}</span>)}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything to <span className="text-blue-600">excel</span>
              </motion.h2>
              <div className="space-y-4">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  const active = activeFeature === i;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                      onClick={() => setActiveFeature(i)} className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-white shadow-xl ring-2 ring-blue-500' : 'bg-white/50 hover:bg-white hover:shadow-md'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${f.gradient} text-white ${active ? 'scale-110' : ''} transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                          <p className={`text-sm text-gray-600 mt-1 transition-all duration-300 ${active ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>{f.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div {...fadeInUp} className="relative h-[400px]">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={i} initial={false} animate={{ opacity: activeFeature === i ? 1 : 0, scale: activeFeature === i ? 1 : 0.8, zIndex: activeFeature === i ? 10 : 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="absolute inset-0">
                    <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${f.gradient} p-1 shadow-2xl`}>
                      <div className="w-full h-full bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4`}>
                          <Icon className="h-14 w-14 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{f.title}</h3>
                        <p className="text-gray-600 mb-4">{f.desc}</p>
                        <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm"><BoltIcon className="h-4 w-4 inline mr-1" />{f.stats}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                {features.map((_, i) => <button key={i} onClick={() => setActiveFeature(i)} className={`w-3 h-3 rounded-full transition-all ${activeFeature === i ? 'bg-blue-600 w-8' : 'bg-gray-300'}`} />)}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA - Dark */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <RocketLaunchIcon className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-200">Start your journey today</span>
          </motion.div>

          <motion.h2 {...fadeInUp} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Your Career?</span>
          </motion.h2>

          <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-xl text-gray-400 mb-10">
            Join {(stats?.students || 0).toLocaleString()}+ Indian learners. No credit card required.
          </motion.p>

          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={isLoggedIn ? "/courses" : "/register"} className="inline-flex items-center px-10 py-5 bg-white text-slate-900 font-bold rounded-full hover:scale-105 shadow-2xl transition-all text-lg">
              {isLoggedIn ? "Explore Courses" : "Get Started Free"} <ArrowRightIcon className="ml-2 h-6 w-6" />
            </Link>
            <Link to="/courses" className="inline-flex items-center px-10 py-5 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 hover:scale-105 transition-all text-lg">
              <PlayCircleIcon className="mr-2 h-6 w-6" /> Watch Demo
            </Link>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500">
            {["Free Trial", "Lifetime Access", "Certificate"].map((item, i) => (
              <div key={i} className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-green-400" /><span className="text-sm">{item}</span></div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;