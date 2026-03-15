// src/pages/LearningInterface.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PlayCircleIcon,
  PauseCircleIcon,
  BookOpenIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import axios from "axios";

const LearningInterface = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [course, setCourse] = useState(null);

  const { courseId } = useParams();




  // fetching enrolled course api to watch course video
  useEffect(()=>{
  const getCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/student/courses/${courseId}/watch`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setCourse(res?.data?.course);

      console.log(res?.data?.course)
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message);
    }

  };
  getCourse();
  },[]);





  const courseModules = [
    {
      id: 1,
      title: "Module 1: Introduction to React",
      lessons: [
        {
          id: 1,
          title: "What is React?",
          duration: "15:30",
          type: "video",
          completed: true,
        },
        {
          id: 2,
          title: "Setting up Development Environment",
          duration: "20:15",
          type: "video",
          completed: true,
        },
        {
          id: 3,
          title: "JSX Fundamentals",
          duration: "25:45",
          type: "video",
          completed: false,
        },
        {
          id: 4,
          title: "Components & Props",
          duration: "30:20",
          type: "video",
          completed: false,
        },
      ],
    },
    {
      id: 2,
      title: "Module 2: React Hooks",
      lessons: [
        {
          id: 5,
          title: "Introduction to Hooks",
          duration: "18:10",
          type: "video",
          completed: false,
        },
        {
          id: 6,
          title: "useState Hook",
          duration: "22:30",
          type: "video",
          completed: false,
        },
        {
          id: 7,
          title: "useEffect Hook",
          duration: "28:45",
          type: "video",
          completed: false,
        },
        {
          id: 8,
          title: "Custom Hooks",
          duration: "35:20",
          type: "video",
          completed: false,
        },
      ],
    },
  ];

  const resources = [
    { type: "pdf", title: "React Cheatsheet.pdf", size: "2.4 MB" },
    { type: "code", title: "Example Code.zip", size: "1.8 MB" },
    { type: "slides", title: "Presentation Slides.pptx", size: "5.2 MB" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Learning:{" "+course?.title}
              </h1>
              <p className="text-gray-300">
                Current Lesson: Components & Props
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-bold">{progress}% Complete</div>
                <div className="w-48 bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                  />
                </div>
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                Complete Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Video Player */}
              <div className="relative pt-[56.25%] bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <video
                    // ref={videoRef}
                    className="absolute inset-0 w-full h-full"
                    src={`${course?.video?.url}`} // replace with your video URL
                    // onEnded={() => setIsPlaying(false)}
                    controls={true}
                  />
                  {isPlaying ? (
                    <div className="text-center">
                      <div className="mb-4 text-gray-400">
                        Video is playing...
                      </div>
                      <button
                        onClick={() => setIsPlaying(false)}
                        className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <PauseCircleIcon className="h-12 w-12" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-110"
                    >
                      <PlayCircleIcon className="h-16 w-16" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Lesson 3: Components & Props
                    </h2>
                    <p className="text-gray-300">
                      Learn how to create reusable components and pass data
                      using props
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-400">
                     {course?.duration}
                    </div>
                    <div className="text-gray-400">Duration</div>
                  </div>
                </div>

                {/* Lesson Navigation */}
                <div className="flex justify-between mt-6">
                  <button className="flex items-center px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <ChevronLeftIcon className="h-5 w-5 mr-2" />
                    Previous Lesson
                  </button>
                  <button className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all">
                    Mark Complete
                    <CheckCircleIcon className="h-5 w-5 ml-2" />
                  </button>
                  <button className="flex items-center px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    Next Lesson
                    <ChevronRightIcon className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Resources Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-400" />
                Lesson Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resources.map((resource, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-blue-500 transition-all cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-900/50 rounded-lg mr-3">
                        <DocumentTextIcon className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold">{resource.title}</div>
                        <div className="text-sm text-gray-400">
                          {resource.size}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Course Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-2 text-purple-400" />
              Course Content
            </h3>

            <div className="space-y-4">
              {courseModules.map((module) => (
                <div
                  key={module.id}
                  className="border border-gray-700 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-900/50 p-4 font-semibold">
                    {module.title}
                  </div>
                  <div className="p-2">
                    {course?.lessons?.map((lesson) => (
                      <motion.div
                        key={lesson._id}
                        whileHover={{ x: 5 }}
                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                          lesson.order === 2
                            ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700"
                            : "hover:bg-gray-700/50"
                        }`}
                        onClick={() => setCurrentLesson(lesson.id - 1)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {lesson.completed ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-500 rounded-full mr-3"></div>
                            )}
                            <span
                              className={
                                lesson.order === 2
                                  ? "font-semibold text-blue-300"
                                  : ""
                              }
                            >
                              {lesson?.description}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <PlayCircleIcon className="h-4 w-4 mr-1" />
                            {lesson?.duration}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Discussion Forum */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h4 className="font-bold mb-4 flex items-center">
                <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Have Questions?
              </h4>
              <textarea
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Ask your question here..."
              />
              <button className="w-full mt-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all">
                Post Question
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LearningInterface;
