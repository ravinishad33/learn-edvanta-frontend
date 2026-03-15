// src/pages/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  BookOpenIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TagIcon,
  GlobeAltIcon,
  CalendarIcon,
  TrophyIcon,
  BookmarkIcon,

  InformationCircleIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  MagnifyingGlassIcon,

  ArrowRightIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  DocumentArrowDownIcon,
  LinkIcon,
  CodeBracketIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModules, setExpandedModules] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock course data - in real app, this would come from an API
  const [course, setCourse] = useState({
    id: 1,
    title: 'Complete React Masterclass 2024',
    subtitle: 'Build Modern Web Applications with React, Hooks, Context, and Redux',
    instructor: {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Frontend Engineer at TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400',
      rating: 4.9,
      students: 45000,
      courses: 12,
      bio: '8+ years of experience in React development. Former lead developer at Facebook. Passionate about teaching modern web development.',
      social: {
        website: 'https://sarahjohnson.dev',
        twitter: '@sarahjohnson',
        linkedin: 'sarahjohnson'
      }
    },
    rating: 4.8,
    reviews: 1245,
    students: 12500,
    duration: '42 hours',
    level: 'Intermediate',
    category: 'Web Development',
    subcategory: 'Frontend Development',
    price: 89.99,
    originalPrice: 149.99,
    discountPercentage: 40,
    isFeatured: true,
    isBestseller: true,
    language: 'English',
    lastUpdated: 'February 2024',
    certificate: true,
    assignments: 15,
    quizzes: 8,
    resources: 45,
    lifetimeAccess: true,
    mobileAccess: true,
    assignmentsAccess: true,
    description: `This comprehensive React course takes you from beginner to advanced level. You'll learn React from the ground up, building real-world applications while mastering modern React features like Hooks, Context API, Redux Toolkit, and advanced patterns.

In this course, you'll build 5+ real-world projects including an e-commerce platform, a social media dashboard, and a real-time chat application. Each project reinforces the concepts you learn and prepares you for real-world React development.

What makes this course special:
• Project-based learning approach
• Latest React 18 features
• TypeScript integration
• Performance optimization techniques
• Testing with Jest and React Testing Library
• Deployment strategies

By the end of this course, you'll have the skills and confidence to build professional React applications and land a job as a React developer.`,
    
    whatYouWillLearn: [
      'Build modern React applications from scratch',
      'Master React Hooks and Context API',
      'Implement Redux for state management',
      'Create reusable components and custom hooks',
      'Optimize performance with React.memo and useMemo',
      'Handle authentication and authorization',
      'Integrate with REST APIs and GraphQL',
      'Deploy React apps to production',
      'Write tests with Jest and React Testing Library',
      'Use TypeScript with React',
      'Implement responsive design',
      'Build Progressive Web Apps (PWA)'
    ],
    
    requirements: [
      'Basic understanding of JavaScript',
      'HTML & CSS fundamentals',
      'No prior React experience required',
      'A computer with internet connection',
      'Willingness to learn and practice'
    ],
    
    whoIsThisFor: [
      'Beginner developers wanting to learn React',
      'Frontend developers looking to upgrade skills',
      'Full-stack developers expanding their frontend knowledge',
      'Web developers transitioning to modern frameworks',
      'Students pursuing web development careers',
      'Entrepreneurs building their own applications'
    ],
    
    curriculum: [
      {
        id: 1,
        title: 'Getting Started with React',
        description: 'Introduction to React ecosystem and setup',
        duration: '6 hours',
        lessons: 8,
        topics: [
          'React Introduction & Philosophy',
          'Setting up Development Environment',
          'Creating Your First React App',
          'JSX Fundamentals',
          'Components & Props',
          'State & Lifecycle',
          'Handling Events',
          'Conditional Rendering'
        ],
        resources: 5
      },
      {
        id: 2,
        title: 'Advanced React Concepts',
        description: 'Deep dive into hooks, context, and performance',
        duration: '10 hours',
        lessons: 12,
        topics: [
          'Hooks Deep Dive (useState, useEffect)',
          'Custom Hooks',
          'Context API',
          'Performance Optimization',
          'Error Boundaries',
          'Code Splitting',
          'Lazy Loading',
          'React Patterns'
        ],
        resources: 8
      },
      {
        id: 3,
        title: 'State Management',
        description: 'Mastering state with Redux and Context',
        duration: '8 hours',
        lessons: 10,
        topics: [
          'Redux Fundamentals',
          'Redux Toolkit',
          'Async Operations with Thunk',
          'Context vs Redux',
          'State Normalization',
          'Persistence Strategies'
        ],
        resources: 6
      },
      {
        id: 4,
        title: 'Real-World Projects',
        description: 'Build complete applications from scratch',
        duration: '18 hours',
        lessons: 15,
        topics: [
          'E-commerce Platform',
          'Social Media Dashboard',
          'Real-time Chat App',
          'Task Management System',
          'Portfolio Website'
        ],
        resources: 12
      }
    ],
    
    reviews: [
      {
        id: 1,
        user: {
          name: 'Alex Johnson',
          avatar: 'AJ',
          role: 'Frontend Developer'
        },
        rating: 5,
        date: '2 weeks ago',
        comment: 'Excellent course! The instructor explains complex concepts in a simple way. The projects are practical and helped me land my first React job.',
        helpful: 124,
        verified: true
      },
      {
        id: 2,
        user: {
          name: 'Maria Garcia',
          avatar: 'MG',
          role: 'Student'
        },
        rating: 4,
        date: '1 month ago',
        comment: 'Great content but could use more practical examples. The course structure is well organized.',
        helpful: 56,
        verified: true
      },
      {
        id: 3,
        user: {
          name: 'David Chen',
          avatar: 'DC',
          role: 'Full Stack Developer'
        },
        rating: 5,
        date: '3 days ago',
        comment: 'Perfect for developers transitioning to React. The Redux section was particularly helpful.',
        helpful: 89,
        verified: true
      }
    ],
    
    faqs: [
      {
        question: 'Do I need prior React experience?',
        answer: 'No, this course starts from the basics and progresses to advanced topics. Basic JavaScript knowledge is recommended.'
      },
      {
        question: 'How long will I have access to the course?',
        answer: 'You get lifetime access to the course content, including future updates.'
      },
      {
        question: 'Is there a certificate upon completion?',
        answer: 'Yes, you will receive a certificate of completion that you can share on LinkedIn.'
      },
      {
        question: 'Can I get a refund if I\'m not satisfied?',
        answer: 'Yes, we offer a 30-day money-back guarantee with no questions asked.'
      }
    ]
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Mock enrollment check
  useEffect(() => {
    // In real app, check if user is enrolled
    const enrolled = localStorage.getItem(`enrolled_${id}`) === 'true';
    setIsEnrolled(enrolled);
  }, [id]);





  // handleEnroll purchasing course 
  // const handleEnroll = () => {
  //   if (course.price > 0) {
  //     setShowPaymentModal(true);
  //   } else {
  //     setIsEnrolled(true);
  //     localStorage.setItem(`enrolled_${id}`, 'true');
  //     navigate(`/learn/${id}`);
  //   }
  // };

  // const handlePayment = () => {
  //   // Simulate payment processing
  //   setTimeout(() => {
  //     setIsEnrolled(true);
  //     setShowPaymentModal(false);
  //     localStorage.setItem(`enrolled_${id}`, 'true');
  //     navigate(`/learn/${id}`);
  //   }, 2000);
  // };

  // const toggleModule = (moduleId) => {
  //   setExpandedModules(prev => ({
  //     ...prev,
  //     [moduleId]: !prev[moduleId]
  //   }));
  // };




 const handleEnroll = (e) => {
  e.preventDefault();
  e.stopPropagation();
    // if (course.price > 0) {
    //   setShowPaymentModal(true);
    // } else {
    //   setIsEnrolled(true);
    //   localStorage.setItem(`enrolled_${id}`, 'true');
    //   navigate(`/learn/${id}`);
    // }

    alert("enrolled")
  }
  



  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setIsEnrolled(true);
      setShowPaymentModal(false);
      localStorage.setItem(`enrolled_${id}`, 'true');
      navigate(`/learn/${id}`);
    }, 2000);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };













  const handleSubmitReview = () => {
    // In real app, submit review to API
    alert('Review submitted successfully!');
    setReviewText('');
  };

  const RatingStars = ({ rating, size = 'h-5 w-5' }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`${size} ${
            i < Math.floor(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );

  // Course stats
  const courseStats = [
    { icon: ClockIcon, label: 'Duration', value: course.duration, color: 'blue' },
    { icon: BookOpenIcon, label: 'Lessons', value: course.curriculum.reduce((acc, mod) => acc + mod.lessons, 0), color: 'green' },
    { icon: DocumentTextIcon, label: 'Resources', value: course.resources, color: 'purple' },
    { icon: TrophyIcon, label: 'Certificate', value: course.certificate ? 'Yes' : 'No', color: 'yellow' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {course.category}
                </span>
                {course.isBestseller && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold">
                    Bestseller
                  </span>
                )}
                {course.isFeatured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-sm font-bold">
                    Featured
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center">
                  <RatingStars rating={course.rating} size="h-6 w-6" />
                  <span className="ml-2 text-blue-100">({course.reviews.toLocaleString()} reviews)</span>
                </div>
                
                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 mr-2" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                
                <div className="flex items-center">
                  <ClockIcon className="h-6 w-6 mr-2" />
                  <span>{course.duration}</span>
                </div>
                
                <div className="flex items-center">
                  <GlobeAltIcon className="h-6 w-6 mr-2" />
                  <span>{course.language}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  {course.instructor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">Created by {course.instructor.name}</p>
                  <p className="text-sm text-blue-200">{course.instructor.title}</p>
                </div>
              </div>
            </div>
            
            {/* Enrollment Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Course Preview Video */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="p-6 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all transform hover:scale-110">
                    <PlayCircleIcon className="h-16 w-16 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 rounded-full text-sm">
                  Preview
                </div>
              </div>
              
              <div className="p-6">
                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl font-bold">${course.price}</span>
                    <span className="ml-3 text-lg text-gray-500 line-through">${course.originalPrice}</span>
                    <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm font-bold rounded">
                      {course.discountPercentage}% OFF
                    </span>
                  </div>
                  <p className="text-gray-600">Limited time offer</p>
                  
                  {/* Countdown Timer */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Offer ends in:</span>
                      <span className="font-bold text-red-600">12:45:32</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, i) => (
                        <div key={label} className="flex-1 text-center">
                          <div className="text-lg font-bold text-gray-900">12</div>
                          <div className="text-xs text-gray-500">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Enrollment Button */}
                {isEnrolled ? (
                  <Link
                    to={`/learn/${id}`}
                    className="block w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 text-center mb-4"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  
                  <button
                  type='button'
                    onClick={(e)=>handleEnroll(e)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 mb-4"
                  >
                    Enroll Now
                  </button>

                
                )}
                
                {/* Money Back Guarantee */}
                <div className="flex items-center justify-center text-sm text-gray-600 mb-6">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" />
                  30-day money-back guarantee
                </div>
                
                {/* Course Includes */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Access on mobile and TV</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>{course.assignments} assignments</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ShareIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <BookmarkIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {courseStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center">
                  <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-3">
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: InformationCircleIcon },
                  { id: 'curriculum', label: 'Curriculum', icon: BookOpenIcon },
                  { id: 'instructor', label: 'Instructor', icon: AcademicCapIcon },
                  { id: 'reviews', label: 'Reviews', icon: StarIcon },
                  { id: 'faq', label: 'FAQ', icon: QuestionMarkCircleIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 font-medium capitalize whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Description */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {showFullDescription 
                            ? course.description 
                            : `${course.description.substring(0, 500)}...`
                          }
                        </p>
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {showFullDescription ? 'Show Less' : 'Read More'}
                        </button>
                      </div>
                    </div>

                    {/* What You'll Learn */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="text-gray-700">{req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Who is this course for */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Who this course is for</h3>
                      <div className="flex flex-wrap gap-3">
                        {course.whoIsThisFor.map((audience, index) => (
                          <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'curriculum' && (
                  <motion.div
                    key="curriculum"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Curriculum Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{course.curriculum.length}</div>
                          <div className="text-gray-600">Modules</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {course.curriculum.reduce((acc, mod) => acc + mod.lessons, 0)}
                          </div>
                          <div className="text-gray-600">Lessons</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">{course.duration}</div>
                          <div className="text-gray-600">Total Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-yellow-600">{course.resources}</div>
                          <div className="text-gray-600">Resources</div>
                        </div>
                      </div>
                    </div>

                    {/* Modules */}
                    <div className="space-y-4">
                      {course.curriculum.map((module) => (
                        <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full p-6 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                <BookOpenIcon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-bold text-gray-900 text-lg">{module.title}</h4>
                                <p className="text-gray-600 mt-1">{module.description}</p>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  <span className="mr-4">{module.duration}</span>
                                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                                  <span>{module.lessons} lessons</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              {expandedModules[module.id] ? (
                                <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                              ) : (
                                <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {expandedModules[module.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 border-t border-gray-200">
                                  <div className="space-y-3">
                                    {module.topics.map((topic, index) => (
                                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <PlayCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                                        <span className="text-gray-700">{topic}</span>
                                        {index < 2 && (
                                          <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                            Preview
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      {module.resources} resources available
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                      Download Resources
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'instructor' && (
                  <motion.div
                    key="instructor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Instructor Profile */}
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img 
                            src={course.instructor.avatar} 
                            alt={course.instructor.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-900">{course.instructor.name}</h3>
                        <p className="text-gray-600 text-lg mt-2">{course.instructor.title}</p>
                        
                        <div className="flex items-center space-x-6 mt-4">
                          <div className="flex items-center">
                            <RatingStars rating={course.instructor.rating} />
                            <span className="ml-2 text-gray-600">Instructor Rating</span>
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="h-5 w-5 text-gray-600 mr-2" />
                            <span>{course.instructor.students.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpenIcon className="h-5 w-5 text-gray-600 mr-2" />
                            <span>{course.instructor.courses} courses</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructor Bio */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">About the Instructor</h4>
                      <p className="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                    </div>

                    {/* Instructor Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                        <div className="text-4xl font-bold text-blue-600 mb-2">4.9/5</div>
                        <div className="text-gray-700">Average Rating</div>
                        <RatingStars rating={4.9} />
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                        <div className="text-4xl font-bold text-green-600 mb-2">45K+</div>
                        <div className="text-gray-700">Total Students</div>
                        <div className="text-sm text-gray-600">Across all courses</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                        <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
                        <div className="text-gray-700">Published Courses</div>
                        <div className="text-sm text-gray-600">On this platform</div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Connect with Instructor</h4>
                      <div className="flex space-x-4">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          View Profile
                        </button>
                        <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                          Message
                        </button>
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                          View All Courses
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Overall Rating */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-center md:text-left">
                          <div className="text-5xl font-bold text-gray-900 mb-2">{course.rating}</div>
                          <RatingStars rating={course.rating} size="h-6 w-6" />
                          <p className="text-gray-600 mt-2">Course Rating • {course.reviews.toLocaleString()} reviews</p>
                        </div>
                        
                        <div className="w-full md:w-64 mt-6 md:mt-0">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center mb-2">
                              <div className="w-12 text-gray-600">{stars} star{stars > 1 ? 's' : ''}</div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                                <div 
                                  className="h-2 bg-yellow-400 rounded-full"
                                  style={{ 
                                    width: stars === 5 ? '70%' : 
                                           stars === 4 ? '20%' : 
                                           stars === 3 ? '8%' : 
                                           stars === 2 ? '2%' : '0%' 
                                  }}
                                ></div>
                              </div>
                              <div className="w-12 text-gray-600 text-right">
                                {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '8%' : stars === 2 ? '2%' : '0%'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Write Review */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="p-1"
                              >
                                <StarIcon
                                  className={`h-8 w-8 ${
                                    star <= rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Share your experience with this course..."
                          />
                        </div>
                        
                        <button
                          onClick={handleSubmitReview}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold text-gray-900">Recent Reviews</h4>
                      {course.reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                                {review.user.avatar}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">{review.user.name}</div>
                                <div className="text-sm text-gray-600">{review.user.role}</div>
                                <div className="flex items-center mt-1">
                                  <RatingStars rating={review.rating} />
                                  {review.verified && (
                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      Verified Student
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-gray-500 text-sm">{review.date}</div>
                          </div>
                          <p className="text-gray-700 mb-4">{review.comment}</p>
                          <div className="flex justify-between items-center">
                            <button className="text-gray-500 hover:text-gray-700 text-sm">
                              Helpful ({review.helpful})
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Report
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'faq' && (
                  <motion.div
                    key="faq"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {course.faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleModule(`faq-${index}`)}
                          className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <h4 className="text-lg font-medium text-gray-900 text-left">{faq.question}</h4>
                          {expandedModules[`faq-${index}`] ? (
                            <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                          ) : (
                            <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {expandedModules[`faq-${index}`] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 pt-0">
                                <p className="text-gray-700">{faq.answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Related Courses */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Students also bought</h3>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm">
                      Web Development
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Node.js Backend Development</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="mr-4">4.7 (890 reviews)</span>
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>4,500 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">$79.99</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        View Course
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Complete Enrollment</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Course Price</span>
                      <span className="font-medium">${course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discount</span>
                      <span className="font-medium text-green-600">-${(course.originalPrice - course.price).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${course.price}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code (Optional)
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={selectedCoupon}
                        onChange={(e) => setSelectedCoupon(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg"
                        placeholder="Enter coupon code"
                      />
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-r-lg hover:bg-gray-700">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Pay with Credit Card
                    </button>
                    <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                      Pay with PayPal
                    </button>
                    <button className="w-full py-3 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50">
                      Other Payment Methods
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    By completing your purchase you agree to our Terms of Service
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetail;