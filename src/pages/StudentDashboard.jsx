// src/pages/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {Link} from 'react-router-dom'
import { 
  AcademicCapIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ChartBarIcon,
  BookOpenIcon,
  TrophyIcon,
  CalendarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [studentCourse, setStudentCourse] = useState([]);





// console.log(studentCourse)






 // calling to get all student enrolled  courses
  useEffect(() => {
    const getStudentCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student/enrolled-courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        // console.log(res?.data.courses);
        setStudentCourse(res?.data?.courses);
      } catch (error) {
        console.log(error);
      }
    };
    getStudentCourses();
  }, []);






  const enrolledCourses = [
    {
      id: 1,
      title: 'React Masterclass',
      instructor: 'John Doe',
      progress: 75,
      duration: '8 weeks',
      nextLesson: 'Advanced Hooks',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400'
    },
    {
      id: 2,
      title: 'Data Science Fundamentals',
      instructor: 'Jane Smith',
      progress: 40,
      duration: '12 weeks',
      nextLesson: 'Pandas Deep Dive',
      category: 'Data Science',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400'
    }
  ];

  const upcomingAssignments = [
    { id: 1, course: 'React Masterclass', title: 'Final Project', dueDate: '2024-03-15', status: 'pending' },
    { id: 2, course: 'Data Science', title: 'Quiz 3', dueDate: '2024-03-10', status: 'pending' }
  ];

  const certificates = [
    { id: 1, course: 'JavaScript Basics', issuedDate: '2024-01-15' },
    { id: 2, course: 'Python Programming', issuedDate: '2024-02-01' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
    

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ClockIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Learning Hours</p>
                <p className="text-2xl font-bold text-gray-900">124</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrophyIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold">
                    View All
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {studentCourse?.map((course) => (
                    <motion.div
                      key={course._id}
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col sm:flex-row items-center bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300"
                    >
                      <div className="w-full sm:w-32 h-32 mb-4 sm:mb-0">
                        <img 
                          src={course?.courseId?.thumbnail?.url} 
                          alt={course?.title }
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 sm:ml-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{course?.title } </h3>
                            {/* <p className="text-gray-600">by {course?.instructor }</p> */}
                            <div className="flex items-center mt-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {course?.category?.name}
                              </span>
                              <span className="ml-3 text-sm text-gray-500">
                                <ClockIcon className="inline h-4 w-4 mr-1" />
                                {course?.totalDuration}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {course?.progress}%
                            </div>
                            <div className="text-sm text-gray-500">Progress</div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${course?.progress}%` }}
                              transition={{ duration: 1 }}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>Next:  
                              {/* {course?.nextLesson} */}
                              { " "+course?.courseId?.lessons[0]?.description}
                            </span>
                          <Link  
                          to={`/mycourses/learn/${course?.courseId?._id}`}
                          >Continue Learning →</Link>
                            {/* <span>Continue Learning →</span> */}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Upcoming Assignments */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-6 w-6 text-orange-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Upcoming Assignments</h3>
              </div>
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600">{assignment.course}</p>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                        Due: {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrophyIcon className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Certificates</h3>
              </div>
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{cert.course}</p>
                        <p className="text-sm text-gray-600">Issued: {cert.issuedDate}</p>
                      </div>
                      <button className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded hover:bg-green-200 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Learning Stats</h3>
              </div>
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
                  <p className="text-gray-600">Overall Progress</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;