
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

const PageNotFound = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };


  const popularPages = [
    { id: 'home', title: 'Home', description: 'Return to homepage', icon: HomeIcon, path: '/' },
    { id: 'courses', title: 'Course Catalog', description: 'Browse all courses', icon: BookOpenIcon, path: '/courses' },
  ];

  // Search suggestions
const searchSuggestions = [
  // Categories
  { id: 'web-development', text: 'Web Development' },
  { id: 'mobile-app-development', text: 'Mobile App Development' },
  { id: 'devops', text: 'Devops' },
  { id: 'creative-design', text: 'Creative & Design' },
  { id: 'cloud-computing', text: 'Cloud Computing' },
  { id: 'graphic-design', text: 'Graphic Design' },
   { id: 'artificial-intelligence', text: 'Artificial Intelligence' },
  { id: 'cyber-security', text: 'Cyber Security' },
];

  // Fun facts
  const funFacts = [
    { id: 'fact1', text: "The first 404 error was discovered in 1992." },
    { id: 'fact2', text: "A great 404 page can actually improve user retention." },
    { id: 'fact3', text: "404 is the HTTP status code for 'Not Found'." },
    { id: 'fact4', text: "Looks like this page is taking a coffee break ☕" },
    { id: 'fact5', text: "You didn't break the internet, but we can't find this page." }
  ];

  // Random fact (computed once per mount to avoid hydration mismatch if using SSR)
  const [randomFact] = useState(() => funFacts[Math.floor(Math.random() * funFacts.length)]);

  return (
    <div className="min-h-screen bg-[#0A0514] flex flex-col font-sans selection:bg-[#8B6ED7] selection:text-white relative overflow-hidden">
      
      {/* Premium Dark Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B6ED7] to-transparent blur-[120px] mix-blend-screen" />
      </div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#432C81] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-[#7354C4] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto w-full"
        >
          {/* Glowing 404 Text */}
          <motion.div variants={itemVariants} className="mb-6 relative">
            <motion.h1
              animate={{ 
                textShadow: [
                  "0px 0px 20px rgba(139,110,215,0.2)",
                  "0px 0px 40px rgba(139,110,215,0.6)",
                  "0px 0px 20px rgba(139,110,215,0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-[#E9D8FD] to-[#8B6ED7] select-none"
            >
              404
            </motion.h1>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight"
          >
            Lost in the <span className="text-[#D8B4FE]">Learning Universe?</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl mx-auto font-light leading-relaxed"
          >
            The page you're looking for has drifted into deep space. Let's get you back on track to mastering new skills.
          </motion.p>

          {/* Fun Fact Glass Pill */}
          <motion.div variants={itemVariants} className="mb-12 flex justify-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
              <LightBulbIcon className="h-5 w-5 text-[#D8B4FE] mr-2.5 shrink-0" />
              <span className="text-slate-300 text-xs sm:text-sm font-medium">{randomFact.text}</span>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-14 w-full">
            <form onSubmit={handleSearch} className="relative group">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#D8B4FE] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses, skills, or topics..."
                className="w-full pl-14 pr-32 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B6ED7]/50 focus:border-[#8B6ED7] focus:bg-white/10 transition-all backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2.5 bg-[#8B6ED7] text-white font-bold text-sm rounded-xl hover:bg-[#7354C4] active:scale-95 transition-all shadow-md shadow-[#8B6ED7]/20"
              >
                Search
              </button>
            </form>
            
            {/* Search Suggestions */}
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              {searchSuggestions.map((suggestion) => (
                <button
                  key={`suggestion-${suggestion.id}`}
                  onClick={() => {
                    setSearchQuery(suggestion.text);
                    navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
                  }}
                  className="px-3.5 py-1.5 bg-white/5 text-slate-300 border border-white/10 rounded-full text-xs font-medium hover:bg-white/10 hover:text-white transition-all"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Navigation Grid */}
          <motion.div variants={itemVariants} className="mb-12 w-full">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Quick Navigators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {popularPages.map((page) => (
                <Link
                  key={`page-${page.id}`}
                  to={page.path}
                  className="group flex items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#8B6ED7]/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="p-3 bg-[#8B6ED7]/20 rounded-xl mr-4 group-hover:bg-[#8B6ED7] transition-colors duration-300">
                    <page.icon className="h-5 w-5 text-[#D8B4FE] group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{page.title}</div>
                    <div className="text-xs text-slate-400 truncate group-hover:text-slate-300 transition-colors">{page.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center backdrop-blur-sm"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </button>
            
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#8B6ED7] text-white font-bold rounded-xl hover:bg-[#7354C4] active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-[#8B6ED7]/25"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Return Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PageNotFound;