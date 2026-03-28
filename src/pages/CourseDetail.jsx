import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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
  AcademicCapIcon,
  GlobeAltIcon,
  TrophyIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { CrossIcon, XCircleIcon } from "lucide-react";

const CourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const courseId = useParams().id;

  // Get user from Redux store
  const reduxUser = useSelector((state) => state?.auth?.user);

  // State
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModules, setExpandedModules] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;


  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${apiUrl}/api/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          setCourse(response?.data?.course);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error(
          error.response.data.message || "Failed to load course details",
        );
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // handling payment and enrollment
  const handlePayment = async () => {
    if (!course?._id) return;
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing payment...");

    try {
      const token = localStorage.getItem("token");
      const PayAmount = course?.price - (course?.discountPrice || 0);

      // 1 Create Razorpay order
      const { data: orderData } = await axios.post(
        `${apiUrl}/api/payment/create-order`,
        { courseId: course._id, amount: PayAmount },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 2 Configure Razorpay
      const options = {
        key: orderData?.key_id,
        amount: orderData?.amount,
        currency: orderData?.currency,
        name: "Edvanta",
        image:"http://res.cloudinary.com/degk0nxby/image/upload/v1773579946/logoIcon/icon_pxpdyx.png",
        description: "Secure online payment for Edvanta courses and services.",
        order_id: orderData?.id,
        handler: async (response) => {
          try {
            // 3 Verify payment
            const payRes = await axios.post(
              `${apiUrl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course?._id,
                amount: orderData.amount,
                receipt: orderData.receipt,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            toast.success(
              payRes?.data?.message || "Payment & Enrollment successful!",
              { id: toastId },
            );

            // 4 redirect after successful payment
            navigate(`/mycourses/learn/${course?._id}`);
          } catch (err) {
            toast.error(
              err?.response?.data?.message || "Payment verification failed",
              { id: toastId },
            );
          }
        },
        prefill: {
          name: reduxUser?.name || "",
          email: reduxUser?.email || "",
          contact: reduxUser?.phone || "",
        },
        theme: { color: "#5A67D8" },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        console.error("Payment Failed", response);
        alert("payment failed!");
        toast.error("Payment Failed!", {
          id: toastId,
        });
      });
      rzp1.open();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!", {
        id: toastId,
      });
    } finally {
      setShowPaymentModal(false);
      setLoading(false);
    }
  };


  // handle enrollments paid + free (if price >0: paid else free)
  const handleEnroll = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  try {
    // Paid course → open payment modal
    if (course.price > 0) {
      setShowPaymentModal(true);
    } else {
      // loading toast
      const toastId = toast.loading("Enrolling In The Course...");

      const res = await axios.post(
        `${apiUrl}/api/enrollments/free-enroll`,
        { courseId: course._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // success update
      toast.success(res?.data?.message || "Enrolled successfully!", {
        id: toastId,
      });

      navigate(`/mycourses/learn/${course._id}`);
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Enrollment failed"
    );
  }
};


  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${apiUrl}/api/course/${courseIdid}/review`,
        { rating, comment: reviewText },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Review submitted successfully!");
      setReviewText("");
      setRating(5);

      // Refresh course data to show new review
      const response = await axios.get(
        `${apiUrl}/api/course/${courseId}`,
      );
      setCourse(response.data.course);
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  // Derived data
  const discountPercentage =
    course?.price > 0 && course?.discountPrice >= 0
      ? Math.round((course.discountPrice / course.price) * 100)
      : 0;

  const finalPrice =
    course?.price > 0 && course?.discountPrice >= 0
      ? Math.max(course.price - course.discountPrice, 0)
      : 0;

  const courseStats = [
    {
      icon: ClockIcon,
      label: "Duration",
      value: course.totalDuration,
      color: "blue",
    },
    {
      icon: BookOpenIcon,
      label: "Lessons",
      value: course.totalLessons,
      color: "green",
    },
    {
      icon: TrophyIcon,
      label: "Certificate",
      value: course.certificate ? "Yes" : "No",
      color: "yellow",
    },
    {
      icon: GlobeAltIcon,
      label: "Language",
      value: course.language,
      color: "purple",
    },
  ];

  const RatingStars = ({ rating, size = "h-5 w-5" }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`${size} ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-white">{rating?.toFixed(1)}</span>
    </div>
  );

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
                  {course.category?.name}
                </span>
                {course.level && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm capitalize">
                    {course.level}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-blue-100 mb-6 line-clamp-2">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center">
                  <RatingStars
   
                    rating={course?.averageRating || 0}
                    size="h-6 w-6"
                  />
                  <span className="ml-2 text-blue-100">
                    ({course?.totalReviews || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 mr-2" />
                  <span>{course?.enrolledStudents?.length || 0} students</span>
                </div>

                <div className="flex items-center">
                  <ClockIcon className="h-6 w-6 mr-2" />
                  <span>{course?.totalDuration}</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  {course.instructor?.name?.charAt(0) || "I"}
                </div>
                <div>
                  <p className="font-semibold">
                    Created by {course.instructor?.name}
                  </p>
                  <p className="text-sm text-blue-200">
                    {course.instructor?.title || "Instructor"}
                  </p>
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
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="p-6 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all transform hover:scale-110">
                    <PlayCircleIcon className="h-16 w-16 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl font-bold">
                      ₹{course?.price - course?.discountPrice}
                    </span>
                    {course.discountPrice > 0 && (
                      <>
                        <span className="ml-3 text-lg text-gray-500 line-through">
                          ₹{course?.price}
                        </span>
                        <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm font-bold rounded">
                          {discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Enrollment Button */}
                {reduxUser?._id === course?.instructor?._id ? (
                  <Link
                    to={`/mycourses/learn/${id}`}
                    className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 text-center mb-4"
                  >
                    View Course
                  </Link>
                ) : course?.isEnrolled ? (
                  <Link
                    to={`/mycourses/learn/${id}`}
                    className="block w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 text-center mb-4"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
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
                    {course?.certificate ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span>Certificate of completion</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        <span>Certificate Not Available for This Course</span>
                      </>
                    )}
                  </div>
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
                    <div className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex">
                {[
                  {
                    id: "overview",
                    label: "Overview",
                    icon: InformationCircleIcon,
                  },
                  { id: "curriculum", label: "Curriculum", icon: BookOpenIcon },
                  {
                    id: "instructor",
                    label: "Instructor",
                    icon: AcademicCapIcon,
                  },
                  { id: "reviews", label: "Reviews", icon: StarIcon },
                  { id: "faq", label: "FAQ", icon: QuestionMarkCircleIcon },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Description */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Description
                      </h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {showFullDescription
                            ? course.description
                            : `${course.description?.substring(0, 500)}...`}
                        </p>
                        {course.description?.length > 500 && (
                          <button
                            onClick={() =>
                              setShowFullDescription(!showFullDescription)
                            }
                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {showFullDescription ? "Show Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <motion.div
                    key="curriculum"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {course.sections?.length || 0}
                          </div>
                          <div className="text-gray-600">Sections</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {course.totalLessons || 0}
                          </div>
                          <div className="text-gray-600">Lessons</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {course.totalDuration}
                          </div>
                          <div className="text-gray-600">Duration</div>
                        </div>
                      </div>
                    </div>

                    {/* Modules */}
                    <div className="space-y-4">
                      {course.sections?.map((section, idx) => (
                        <div
                          key={section._id || idx}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => toggleModule(section._id || idx)}
                            className="w-full p-6 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                <BookOpenIcon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {section.title}
                                </h4>
                                <p className="text-gray-600 mt-1 line-clamp-1">
                                  {section.description || "No description"}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  <span className="mr-4">
                                    {section.totalDuration || "0 min"}
                                  </span>
                                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                                  <span>
                                    {section.lessons?.length || 0} lessons
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              {expandedModules[section._id || idx] ? (
                                <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                              ) : (
                                <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                          </button>

                          <AnimatePresence>
                            {expandedModules[section._id || idx] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 border-t border-gray-200">
                                  <div className="space-y-3">
                                    {section.lessons?.map(
                                      (lesson, lessonIdx) => (
                                        <div
                                          key={lesson._id || lessonIdx}
                                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                                        >
                                          <PlayCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                                          <span className="text-gray-700 flex-1">
                                            {lesson.title}
                                          </span>
                                          {lesson.duration && (
                                            <span className="text-sm text-gray-500">
                                              {lesson.duration}
                                            </span>
                                          )}
                                        </div>
                                      ),
                                    )}
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

                {/* Instructor Tab */}
                {activeTab === "instructor" && (
                  <motion.div
                    key="instructor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          {course?.instructor?.avatar?.url ? (
                            <img
                              src={course?.instructor?.avatar?.url}
                              alt={course.instructor.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                              {course.instructor?.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-900">
                          {course.instructor?.name}
                        </h3>
                        <p className="text-gray-600 text-lg mt-2">
                          {course.instructor?.title || "Instructor"}
                        </p>
                        <p className="text-gray-700 mt-4">
                          {course.instructor?.bio || "No bio available"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Write Review - Only show if enrolled */}
                    {isEnrolled && (
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">
                          Write a Review
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Rating
                            </label>
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
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Review
                            </label>
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
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold text-gray-900">
                        Reviews ({course.reviews?.length || 0})
                      </h4>
                      {course.reviews?.length > 0 ? (
                        course?.reviews?.map((review, idx) => (
                          <div
                            key={review?._id || idx}
                            className="border border-gray-200 rounded-xl p-6"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center">
                                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                                  {review.user?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">
                                    {review.student?.name || "Anonymous"}
                                  </div>
                                  <RatingStars
                                    rating={review.rating || 5}
                                    size="h-4 w-4"
                                  />
                                </div>
                              </div>
                              <div className="text-gray-500 text-sm">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No reviews yet. Be the first to review!
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* FAQ Tab */}
                {activeTab === "faq" && (
                  <motion.div
                    key="faq"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-gray-500 text-center py-8">
                      Frequently asked questions will appear here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  <h3 className="text-xl font-bold text-gray-900">
                    Complete Enrollment
                  </h3>
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
                      <span className="font-medium">₹{course?.price}</span>
                    </div>
                    {course?.discountPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Discount</span>
                        <span className="font-medium text-green-600">
                          -₹{course?.discountPrice}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{finalPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                    {/* coupon code feild */}
                  {/* <div>
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
                  </div> */}

                  <button
                    onClick={handlePayment}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Pay ₹{finalPrice}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By completing your purchase you agree to our Terms of
                    Service
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