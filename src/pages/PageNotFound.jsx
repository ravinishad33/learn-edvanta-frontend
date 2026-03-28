// src/pages/PageNotFound.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
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
        delayChildren: 0.2
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
        stiffness: 100
      }
    }
  };

  // Handle search - redirects to search results page
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Popular pages for quick navigation
  const popularPages = [
    { id: 'home', title: 'Home', description: 'Return to homepage', icon: HomeIcon, path: '/', color: 'blue' },
    { id: 'courses', title: 'Course Catalog', description: 'Browse all courses', icon: BookOpenIcon, path: '/courses', color: 'green' },
    { id: 'student', title: 'Student Dashboard', description: 'Your learning dashboard', icon: AcademicCapIcon, path: '/student-dashboard', color: 'purple' },
    { id: 'instructor', title: 'Instructor Dashboard', description: 'Teaching dashboard', icon: UserGroupIcon, path: '/instructor-dashboard', color: 'orange' },
  ];

  // Search suggestions
  const searchSuggestions = [
    { id: 'react', text: 'React Development' },
    { id: 'python', text: 'Python Programming' },
    { id: 'web', text: 'Web Design' },
    { id: 'data', text: 'Data Analysis' },
    { id: 'mobile', text: 'Mobile Apps' },
    { id: 'cloud', text: 'Cloud Computing' },
  ];

  // Fun facts
  const funFacts = [
    { id: 'fact1', text: "The first 404 error was discovered in 1992" },
    { id: 'fact2', text: "404 pages can improve user engagement by 30%" },
    { id: 'fact3', text: "Some websites have 404 pages with games" },
    { id: 'fact4', text: "404 is actually an HTTP status code" },
    { id: 'fact5', text: "The page you're looking for is taking a coffee break ☕" }
  ];

  // Random fact
  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Simple CSS Background - No keys needed */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* 404 Error */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h1
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-8xl md:text-[10rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              404
            </motion.h1>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Oops! Page Not Found
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 mb-8 max-w-xl mx-auto"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>

          {/* Fun Fact */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full border border-yellow-200">
              <LightBulbIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-gray-700 text-sm">{randomFact.text}</span>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-10">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for courses..."
                  className="w-full pl-12 pr-24 py-4 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700"
                >
                  Search
                </button>
              </div>
            </form>
            
            {/* Search Suggestions - With UNIQUE keys */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {searchSuggestions.map((suggestion) => (
                <button
                  key={`suggestion-${suggestion.id}`} // ✅ UNIQUE KEY
                  onClick={() => {
                    setSearchQuery(suggestion.text);
                    navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Navigation - With UNIQUE keys */}
          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {popularPages.map((page) => (
                <Link
                  key={`page-${page.id}`} // ✅ UNIQUE KEY
                  to={page.path}
                  className="flex items-center p-3 bg-white rounded-xl shadow hover:shadow-md transition-all border border-gray-100"
                >
                  <div className={`p-2 bg-${page.color}-100 rounded-lg mr-3`}>
                    <page.icon className={`h-5 w-5 text-${page.color}-600`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{page.title}</div>
                    <div className="text-xs text-gray-500">{page.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 flex items-center justify-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </button>
            
            <Link
              to="/"
              className="px-6 py-3 bg-white text-gray-900 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PageNotFound;