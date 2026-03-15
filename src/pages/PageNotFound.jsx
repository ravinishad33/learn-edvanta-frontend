// src/pages/PageNotFound.jsx
import React from 'react';
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
  GlobeAltIcon,
  CommandLineIcon,
  ServerIcon,
  CloudIcon,
  BeakerIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  SparklesIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const PageNotFound = () => {
  const navigate = useNavigate();

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

  const floatAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Popular pages for quick navigation
  const popularPages = [
    {
      title: 'Home',
      description: 'Return to homepage',
      icon: HomeIcon,
      path: '/',
      color: 'blue'
    },
    {
      title: 'Course Catalog',
      description: 'Browse all courses',
      icon: BookOpenIcon,
      path: '/courses',
      color: 'green'
    },
    {
      title: 'Student Dashboard',
      description: 'Your learning dashboard',
      icon: AcademicCapIcon,
      path: '/student-dashboard',
      color: 'purple'
    },
    {
      title: 'Instructor Dashboard',
      description: 'Teaching dashboard',
      icon: UserGroupIcon,
      path: '/instructor-dashboard',
      color: 'orange'
    },
    {
      title: 'Admin Dashboard',
      description: 'Platform management',
      icon: ShieldCheckIcon,
      path: '/admin-dashboard',
      color: 'red'
    },
    {
      title: 'Profile',
      description: 'Your profile settings',
      icon: Cog6ToothIcon,
      path: '/profile',
      color: 'pink'
    }
  ];

  // Course categories
  const courseCategories = [
    {
      name: 'Web Development',
      icon: CommandLineIcon,
      count: '1,245 courses',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Data Science',
      icon: ChartBarIcon,
      count: '856 courses',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Mobile Development',
      icon: DevicePhoneMobileIcon,
      count: '634 courses',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Cloud & DevOps',
      icon: CloudIcon,
      count: '423 courses',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      name: 'AI & Machine Learning',
      icon: BeakerIcon,
      count: '587 courses',
      color: 'from-red-500 to-rose-500'
    },
    {
      name: 'Cybersecurity',
      icon: ShieldCheckIcon,
      count: '312 courses',
      color: 'from-indigo-500 to-violet-500'
    }
  ];

  // Fun facts about 404
  const funFacts = [
    "The first 404 error was discovered in 1992",
    "404 pages can improve user engagement by 30%",
    "Some websites have 404 pages with games",
    "404 is actually an HTTP status code",
    "The page you're looking for is taking a coffee break ☕"
  ];

  // Search suggestions
  const searchSuggestions = [
    'React Development',
    'Python Programming',
    'Web Design',
    'Data Analysis',
    'Mobile Apps',
    'Cloud Computing'
  ];

  const handleSearch = (query) => {
    navigate(`/courses?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-6xl mx-auto"
        >
          {/* Error Code */}
          <motion.div
            variants={itemVariants}
            className="relative mb-8"
          >
            <motion.div
              animate={floatAnimation}
              className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              404
            </motion.div>
            
            {/* Animated Icon */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <ExclamationTriangleIcon className="h-24 w-24 text-yellow-500/30" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Oops! Page Not Found
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            The page you're looking for seems to have wandered off into the digital universe. 
            Don't worry, we'll help you find your way back!
          </motion.p>

          {/* Fun Fact */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full border border-yellow-200">
              <LightBulbIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-gray-700">
                {funFacts[Math.floor(Math.random() * funFacts.length)]}
              </span>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            variants={itemVariants}
            className="max-w-xl mx-auto mb-12"
          >
            <div className="relative">
              <MagnifyingGlassIcon  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleSearch(e.target.value);
                  }
                }}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700">
                Search
              </button>
            </div>
            
            {/* Search Suggestions */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularPages.map((page, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={page.path}
                    className={`block p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group`}
                  >
                    <div className="flex items-center">
                      <div className={`p-3 bg-${page.color}-100 rounded-lg mr-4 group-hover:scale-110 transition-transform`}>
                        <page.icon className={`h-6 w-6 text-${page.color}-600`} />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-600">{page.description}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Course Categories */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Course Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {courseCategories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group cursor-pointer"
                  onClick={() => navigate(`/courses?category=${encodeURIComponent(category.name)}`)}
                >
                  <div className={`h-16 w-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-600">{category.count}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 flex items-center justify-center"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Go Back
            </button>
            
            <Link
              to="/"
              className="px-8 py-3 bg-white text-gray-900 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Homepage
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 flex items-center justify-center"
            >
              <RocketLaunchIcon className="h-5 w-5 mr-2" />
              Refresh Page
            </button>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Still Lost?</h3>
            </div>
            <p className="text-gray-700 mb-4">
              If you're having trouble finding what you need, our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@learnsphere.com"
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-center"
              >
                Email Support
              </a>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
                Live Chat
              </button>
              <a
                href="/help"
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
              >
                Help Center
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LearnSphere
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
              <a href="/sitemap" className="text-gray-600 hover:text-gray-900">Sitemap</a>
              <div className="text-gray-600">© 2024 LearnSphere LMS</div>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Floating Help Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl z-50"
        onClick={() => navigate('/help')}
      >
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

// Add missing icon import
const QuestionMarkCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export default PageNotFound;