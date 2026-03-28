// src/pages/LandingPage.js
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const token = localStorage.getItem("token");
  const features = [
    {
      icon: <AcademicCapIcon className="h-12 w-12 text-blue-600" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience",
    },
    {
      icon: <BookOpenIcon className="h-12 w-12 text-purple-600" />,
      title: "Interactive Content",
      description: "Engaging videos, quizzes, and hands-on projects",
    },
    {
      icon: <ChartBarIcon className="h-12 w-12 text-green-600" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics",
    },
    {
      icon: <UserGroupIcon className="h-12 w-12 text-orange-600" />,
      title: "Community Learning",
      description:
        "Collaborate with peers and instructors in discussion forums",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              Learn{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                Without Limits
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              Discover thousands of courses taught by industry experts. Start
              learning today and transform your career with our interactive
              platform.
            </motion.p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {!token && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <PlayCircleIcon className="ml-2 h-5 w-5" />
                </Link>
              )}

              <Link
                to="/courses"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-200"
              >
                Browse Courses
                <BookOpenIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our LMS
            </h2>
            <p className="text-lg text-gray-600">
              Experience the future of online learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6 animate-bounce-in">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      {
        !token &&
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Join as</h2>
            <p className="text-lg text-gray-600">
              Select your role to get started
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                role: "Student",
                icon: <AcademicCapIcon className="h-12 w-12 text-white" />,
                gradient: "from-blue-500 to-cyan-500",
                description: "Learn new skills with interactive courses",
                features: [
                  "Access 5000+ courses",
                  "Progress Tracking",
                  "Earn Certificates",
                ],
              },
              {
                role: "Instructor",
                icon: <UserGroupIcon className="h-12 w-12 text-white" />,
                gradient: "from-purple-500 to-pink-500",
                description: "Share your knowledge with the world",
                features: [
                  "Create Courses",
                  "Monetize Content",
                  "Student Analytics",
                ],
              },
              {
                role: "Admin",
                icon: <ShieldCheckIcon className="h-12 w-12 text-white" />,
                gradient: "from-green-500 to-teal-500",
                description: "Manage and monitor the platform",
                features: [
                  "User Management",
                  "Content Approval",
                  "System Analytics",
                ],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${item.gradient} p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl`}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {item.role}
                  </h3>
                  <p className="text-blue-100 mb-6">{item.description}</p>
                  <ul className="space-y-2 mb-8">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="text-white/90 flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className="inline-block w-full py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Join as {item.role}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



}
      {/* Stats Section */}

      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                number: "50K+",
                label: "Active Students",
                icon: <UserGroupIcon className="h-8 w-8 text-blue-600" />,
              },
              {
                number: "5K+",
                label: "Courses",
                icon: <BookOpenIcon className="h-8 w-8 text-purple-600" />,
              },
              {
                number: "1K+",
                label: "Expert Instructors",
                icon: <AcademicCapIcon className="h-8 w-8 text-green-600" />,
              },
              {
                number: "98%",
                label: "Satisfaction Rate",
                icon: <ChartBarIcon className="h-8 w-8 text-orange-600" />,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 animate-pulse">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}


    </div>
  );
};

export default LandingPage;
