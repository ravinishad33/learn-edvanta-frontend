// src/pages/LearningInterface.js
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Download,
  MessageCircle,
  Award,
  Clock,
  FileText,
  MoreVertical,
  X,
  Loader2,
  Trash2,
  Pencil,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const LearningInterface = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);

  // State
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(true);

  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [userReview, setUserReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Certificate state
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [generatingCert, setGeneratingCert] = useState(false);

  // Discussion state
  const [discussions, setDiscussions] = useState([]);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [sortBy, setSortBy] = useState("Chronological");

  // Edit & Auth State
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // Notification Badge State & Refs
  const [hasUnreadDiscussions, setHasUnreadDiscussions] = useState(false);
  const activeTabRef = useRef(activeTab);
  const currentUserIdRef = useRef(currentUserId);

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  // Clear unread badge when entering discussion tab and trigger scroll
  useEffect(() => {
    activeTabRef.current = activeTab;
    if (activeTab === "discussion") {
      setHasUnreadDiscussions(false);
      scrollToBottom();
    }
  }, [activeTab]);

  // Extract User ID from JWT Token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload._id || payload.id;
        setCurrentUserId(userId);
        currentUserIdRef.current = userId;
      } catch (e) {
        console.error("Failed to decode token");
      }
    }
  }, []);

  const completedLessons = new Set(
    (enrollment?.completedLessons || []).map((id) => id?.toString())
  );

  const allLessons =
    course?.sections?.flatMap(
      (section) =>
        section.lessons?.map((lesson) => ({
          ...lesson,
          sectionId: section._id,
          sectionTitle: section.title,
        })) || []
    ) || [];

  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson._id === currentLesson?._id
  );

  const isCourseCompleted =
    enrollment?.progress === 100 || enrollment?.status === "completed";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear().toString().slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever new messages are added while on discussion tab
  useEffect(() => {
    if (activeTab === "discussion") {
      scrollToBottom();
    }
  }, [discussions, activeTab]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${apiUrl}/api/student/courses/${courseId}/watch`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const courseData = res?.data?.course;
        const enrollmentData = res?.data?.enrollment;

        setCourse(courseData);
        setEnrollment(enrollmentData);
        setUserReview(enrollmentData?.userReview);

        if (
          enrollmentData?.progress === 100 ||
          enrollmentData?.status === "completed"
        ) {
          checkExistingCertificate();
        }

        if (courseData?.sections?.length > 0) {
          const firstSection = courseData.sections[0];
          const firstLesson = firstSection?.lessons?.[0];

          let resumeLesson = firstLesson;
          let resumeSection = firstSection;
          
          // ADDED: Flag to track when we find the first uncompleted lesson
          let found = false; 

          for (const section of courseData.sections) {
            for (const lesson of section.lessons || []) {
              if (!completedLessons.has(lesson._id?.toString())) {
                resumeLesson = lesson;
                resumeSection = section;
                found = true; // Set flag
                break; // Break inner loop
              }
              resumeLesson = lesson;
              resumeSection = section;
            }
            if (found) break; // Break outer loop so it doesn't jump to the end
          }

          setCurrentLesson(resumeLesson);
          setCurrentSection(resumeSection);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course");
        navigate("/mycourses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiUrl}/api/discussions/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscussions(res.data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "discussion" && courseId) {
      fetchDiscussions();
    }
  }, [activeTab, courseId]);

  // Real-time Socket.io Listeners
  useEffect(() => {
    if (!courseId) return;

    const socket = io(apiUrl);
    socket.emit("join_course", courseId);

    socket.on("new_post", (post) => {
      setDiscussions((prev) => {
        if (prev.some((p) => p._id === post._id)) return prev;

        if (
          activeTabRef.current !== "discussion" &&
          post.user !== currentUserIdRef.current
        ) {
          setHasUnreadDiscussions(true);
        }
        return [...prev, post]; // Appending to the end for top-to-bottom layout
      });
    });

    socket.on("new_reply", (reply) => {
      setDiscussions((prev) => {
        let isDuplicate = false;

        const newState = prev.map((d) => {
          if (d._id === reply.parentId) {
            if (d.replies?.some((r) => r._id === reply._id)) {
              isDuplicate = true;
              return d;
            }
            // Replies already append to the end
            return { ...d, replies: [...(d.replies || []), reply] };
          }
          return d;
        });

        if (
          !isDuplicate &&
          activeTabRef.current !== "discussion" &&
          reply.user !== currentUserIdRef.current
        ) {
          setHasUnreadDiscussions(true);
        }

        return newState;
      });
    });

    socket.on("update_upvote", ({ id, upvoteCount }) => {
      setDiscussions((prev) =>
        prev.map((d) => {
          if (d._id === id) return { ...d, upvoteCount };
          if (d.replies) {
            return {
              ...d,
              replies: d.replies.map((r) =>
                r._id === id ? { ...r, upvoteCount } : r
              ),
            };
          }
          return d;
        })
      );
    });

    socket.on("delete_message", ({ id }) => {
      setDiscussions((prev) =>
        prev
          .filter((d) => d._id !== id)
          .map((d) => ({
            ...d,
            replies: d.replies?.filter((r) => r._id !== id),
          }))
      );
    });

    socket.on("edit_message", ({ id, text, isEdited, editedAt }) => {
      setDiscussions((prev) =>
        prev.map((d) => {
          if (d._id === id) return { ...d, text, isEdited, editedAt };
          if (d.replies) {
            return {
              ...d,
              replies: d.replies.map((r) =>
                r._id === id ? { ...r, text, isEdited, editedAt } : r
              ),
            };
          }
          return d;
        })
      );
    });

    return () => socket.disconnect();
  }, [courseId, apiUrl]);

  const handlePostDiscussion = async () => {
    if (!postText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}/api/discussions/post`,
        { course: courseId, text: postText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiscussions((prev) => {
        if (prev.some((p) => p._id === res.data._id)) return prev;
        return [...prev, res.data]; // Append to end
      });

      setPostText("");
      toast.success("Message sent");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post");
    }
  };

  const handleReplyDiscussion = async (parentId) => {
    if (!replyText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}/api/discussions/reply`,
        { course: courseId, parentId, text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiscussions((prev) =>
        prev.map((d) => {
          if (d._id === parentId) {
            if (d.replies?.some((r) => r._id === res.data._id)) return d;
            return { ...d, replies: [...(d.replies || []), res.data] };
          }
          return d;
        })
      );

      setReplyText("");
      setActiveReplyId(null);
      toast.success("Replied successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reply");
    }
  };

  const handleToggleUpvote = async (discussionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}/api/discussions/upvote/${discussionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscussions((prev) =>
        prev.map((d) => {
          if (d._id === discussionId)
            return { ...d, upvoteCount: res.data.upvoteCount };
          const updatedReplies = d.replies?.map((r) =>
            r._id === discussionId
              ? { ...r, upvoteCount: res.data.upvoteCount }
              : r
          );
          return { ...d, replies: updatedReplies };
        })
      );
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDeleteDiscussion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    const toastId = toast.loading("Deleting...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/discussions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDiscussions((prev) =>
        prev
          .filter((d) => d._id !== id)
          .map((d) => ({
            ...d,
            replies: d.replies?.filter((r) => r._id !== id),
          }))
      );

      toast.success("Message deleted", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete", {
        id: toastId,
      });
    }
  };

  const handleEditSubmit = async (id) => {
    if (!editText.trim()) return;

    const toastId = toast.loading("Updating...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${apiUrl}/api/discussions/${id}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiscussions((prev) =>
        prev.map((d) => {
          if (d._id === id)
            return {
              ...d,
              text: res.data.text,
              isEdited: true,
              editedAt: res.data.editedAt,
            };
          if (d.replies) {
            return {
              ...d,
              replies: d.replies.map((r) =>
                r._id === id
                  ? {
                      ...r,
                      text: res.data.text,
                      isEdited: true,
                      editedAt: res.data.editedAt,
                    }
                  : r
              ),
            };
          }
          return d;
        })
      );

      setEditingId(null);
      setEditText("");
      toast.success("Message updated", { id: toastId });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update message",
        { id: toastId }
      );
    }
  };

  const sortedDiscussions = [...discussions].sort((a, b) => {
    if (sortBy === "Top Rated")
      return (b.upvoteCount || 0) - (a.upvoteCount || 0);
    // Chronological sorting (oldest first, so newest pushes to the bottom)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const checkExistingCertificate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${apiUrl}/api/certificate/check/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.exists && res.data?.fileUrl) {
        setCertificateUrl(res.data.fileUrl);
      }
    } catch (error) {
      console.log("No certificate found yet");
    }
  };

  useEffect(() => {
    if (!course || !currentLesson) return;

    const section = course.sections?.find((s) =>
      s.lessons?.some((l) => l._id === currentLesson._id)
    );
    if (section) setCurrentSection(section);
  }, [currentLesson, course]);

  const handleVideoEnded = async () => {
    setIsPlaying(false);
    await markLessonComplete();
    setTimeout(() => handleNext(), 2000);
  };

  useEffect(() => {
    if (enrollment?.progress === 100 && enrollment?.status !== "completed") {
      handleCompleteCourse();
    }
  }, [enrollment]);

  const markLessonComplete = async () => {
    if (
      !currentLesson?._id ||
      completedLessons.has(currentLesson._id?.toString())
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${apiUrl}/api/enrollments/${courseId}/lessons/${currentLesson._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrollment(res?.data?.enrollment);
      toast.success("Lesson completed!");
    } catch (error) {
      console.error("Error marking complete:", error);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLesson(allLessons[currentLessonIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const selectLesson = (lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
    // REMOVED: Mobile sidebar hide logic so it stays visible
    // if (window.innerWidth < 1024) setShowSidebar(false);
  };

  const handleCompleteCourse = async () => {
    const toastId = toast.loading("Completing course...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${apiUrl}/api/enrollments/${courseId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnrollment(res?.data?.enrollment);
      toast.success("Course completed! Generating certificate...", {
        id: toastId,
      });

      await generateCertificate();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to complete course",
        { id: toastId }
      );
    }
  };

  const generateCertificate = async () => {
    setGeneratingCert(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}/api/certificate/generate`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success && res.data?.fileUrl) {
        setCertificateUrl(res?.data?.fileUrl);
        toast.success("Certificate generated!");
      } else {
        toast.error("Failed to generate certificate");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate certificate"
      );
      console.error("Certificate error:", error);
    } finally {
      setGeneratingCert(false);
    }
  };

  const downloadCertificate = async () => {
    if (!certificateUrl) {
      toast.error("No certificate available");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${apiUrl}/api/certificate/download/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const link = document.createElement("a");
      link.href = res.data.downloadUrl || certificateUrl;
      link.download = `certificate-${course?.title?.replace(/\s+/g, "-").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Certificate downloaded!");
    } catch (error) {
      if (certificateUrl) {
        const link = document.createElement("a");
        link.href = certificateUrl;
        link.download = `certificate-${course?.title?.replace(/\s+/g, "-").toLowerCase()}.png`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Failed to download certificate");
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    const toastId = toast.loading(
      userReview ? "Updating review..." : "Submitting review..."
    );
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}/api/course/${courseId}/review`,
        { rating, comment: reviewComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserReview(res.data.review);
      setShowReviewModal(false);
      toast.success(userReview ? "Review updated!" : "Review submitted!", {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review", {
        id: toastId,
      });
    }
  };







  

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7fa] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#8B6ED7] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-[#f8f7fa] flex items-center justify-center">
        <div className="text-center p-4">
          <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7fa] text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-[#E6E6FA] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto min-h-[4rem] py-3 lg:py-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <button
              onClick={() => navigate("/mycourses")}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                {course?.title}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 truncate font-medium mt-0.5">
                {currentSection?.title} • {currentLesson?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-3">
              {user.role === "student" && (
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-900 mb-1">
                    {enrollment?.progress || 0}% Complete
                  </p>
                  <div className="w-16 sm:w-32 h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${enrollment?.progress}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isCourseCompleted && user.role === "student" ? (
                certificateUrl ? (
                  <button
                    onClick={downloadCertificate}
                    className="p-2 sm:px-4 sm:py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <Award className="h-4 w-4" />
                    <span className="hidden sm:inline">Certificate</span>
                    <Download className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </button>
                ) : (
                  <button
                    onClick={generateCertificate}
                    disabled={generatingCert}
                    className="p-2 sm:px-4 sm:py-2 bg-[#8B6ED7] text-white rounded-lg font-bold hover:bg-[#7354C4] transition-colors shadow-sm flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                  >
                    {generatingCert ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Award className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {generatingCert ? "Generating..." : "Get Certificate"}
                    </span>
                  </button>
                )
              ) : (
                user.role === "student" && (
                  <button
                    onClick={handleCompleteCourse}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#8B6ED7] text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-[#7354C4] transition-colors shadow-sm whitespace-nowrap"
                  >
                    Complete
                  </button>
                )
              )}

              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors flex-shrink-0"
              >
                <MoreVertical className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className={`lg:col-span-2 space-y-6 w-full max-w-full ${showSidebar ? "" : "lg:col-span-3"}`}>
            
            {/* Video Player */}
            <div className="bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-[#E6E6FA] aspect-video w-full">
              <video
                ref={videoRef}
                src={currentLesson?.video?.url}
                className="w-full h-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleVideoEnded}
                controls
                poster={course?.thumbnail?.url}
              />
            </div>

            {/* Lesson Info & Controls */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-[#F4F0FA]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 break-words">
                    {currentLesson?.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed break-words">
                    {currentLesson?.description || "No description available"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-semibold">
                    {currentLesson?.duration || "0:00"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-100">
                <button
                  onClick={handlePrevious}
                  disabled={currentLessonIndex === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors disabled:opacity-50 text-sm font-bold border border-transparent hover:border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                  {!completedLessons.has(currentLesson?._id?.toString()) && user?.role === "student" && (
                      <button
                        onClick={markLessonComplete}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors font-bold text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete
                      </button>
                    )}

                  <button
                    onClick={handleNext}
                    disabled={currentLessonIndex === allLessons.length - 1}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 text-sm font-bold shadow-sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tabs Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#F4F0FA] overflow-hidden flex flex-col">
              <div className="flex border-b border-[#F4F0FA] overflow-x-auto no-scrollbar bg-slate-50/50">
                {[
                  { id: "content", label: "Overview", icon: BookOpen },
                  { id: "resources", label: "Resources", icon: FileText },
                  { id: "discussion", label: "Discussion", icon: MessageCircle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold transition-colors relative whitespace-nowrap flex-1 lg:flex-none justify-center ${
                      activeTab === tab.id
                        ? "text-[#8B6ED7] bg-white"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="relative flex items-center">
                      {tab.label}
                      {tab.id === "discussion" && hasUnreadDiscussions && (
                        <span className="absolute -top-1 -right-3 w-2 h-2 bg-[#B39DDB] rounded-full shadow-[0_0_0_2px_white] animate-pulse"></span>
                      )}
                    </span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabLearning"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B6ED7]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content Area */}
              <div className="flex flex-col flex-1">
                {activeTab === "content" && (
                  <div className="p-5 sm:p-6 space-y-4">
                    <h3 className="font-bold text-slate-900">About this Course</h3>
                    <p className="text-sm text-slate-600 leading-relaxed break-words">
                      {course?.description || "No additional information available."}
                    </p>
                    {isCourseCompleted && (
                      <div className="mt-8 p-5 bg-[#F4F0FA] rounded-xl border border-[#E6E6FA]">
                        <h4 className="font-bold text-[#4A3089] mb-1 text-sm sm:text-base">
                          Rate this course
                        </h4>
                        <p className="text-xs sm:text-sm text-[#7354C4] mb-4">
                          Share your feedback to help others.
                        </p>
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-[#8B6ED7] text-white rounded-xl font-bold hover:bg-[#7354C4] transition-colors text-sm shadow-sm"
                        >
                          {userReview ? "Edit Review" : "Write a Review"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {currentLesson?.resources?.length > 0 ? (
                      currentLesson.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-[#D8BFD8] hover:bg-[#F4F0FA] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2.5 bg-[#E6E6FA] rounded-lg shrink-0">
                              <FileText className="h-5 w-5 text-[#8B6ED7]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-sm truncate group-hover:text-[#8B6ED7] transition-colors">
                                {resource.title}
                              </p>
                              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                                {resource.type}
                              </p>
                            </div>
                          </div>
                          <Download className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 shrink-0 group-hover:text-[#8B6ED7] transition-colors" />
                        </a>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <FileText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm font-medium">
                          No resources available for this lesson
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "discussion" && (
                  <div className="flex flex-col h-[400px] sm:h-[500px] lg:h-[600px] animate-in fade-in duration-500 bg-white">
                    
                    {/* Header (Sticky at top) */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#F4F0FA] shrink-0 z-10 bg-white">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        Discussions{" "}
                        <span className="text-slate-400 font-medium ml-1">
                          ({discussions.length})
                        </span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 hidden sm:block font-medium">
                          Sort by:
                        </span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="text-xs sm:text-sm bg-slate-50 p-1.5 rounded-lg font-bold text-slate-600 outline-none cursor-pointer hover:text-[#8B6ED7] transition-colors border border-transparent hover:border-slate-200"
                        >
                          <option value="Chronological">Chronological</option>
                          <option value="Top Rated">Top Rated</option>
                        </select>
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 custom-scrollbar space-y-6">
                      {sortedDiscussions.map((discussion) => (
                        <div key={discussion._id} className="group animate-in slide-in-from-bottom-2 duration-300">
                          <div className="flex gap-3 sm:gap-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E6E6FA] shrink-0 flex items-center justify-center text-[#8B6ED7] font-bold text-xs sm:text-sm uppercase overflow-hidden shadow-sm">
                              {discussion.user.avatar.url ? (
                                <img
                                  src={discussion.user.avatar.url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                discussion.user.name?.substring(0, 2) || "U"
                              )}
                            </div>
                            <div className="flex-1 border-l-2 border-slate-100 pl-3 sm:pl-5 pb-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="font-bold text-slate-900 text-xs sm:text-sm hover:text-[#8B6ED7] cursor-pointer transition-colors break-words">
                                  {discussion.user.name}
                                </span>
                                {discussion.user.role === "instructor" && (
                                  <span className="bg-[#E6E6FA] text-[#7354C4] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    Instructor
                                  </span>
                                )}
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                  {formatDate(discussion.createdAt)}
                                </span>
                                {discussion.isEdited && (
                                  <span className="text-[10px] text-slate-400 italic">
                                    (edited {formatDate(discussion.editedAt)})
                                  </span>
                                )}
                              </div>

                              {editingId === discussion._id ? (
                                <div className="mt-2 flex flex-col gap-2">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8B6ED7] outline-none resize-none bg-slate-50"
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleEditSubmit(discussion._id)}
                                      disabled={!editText.trim()}
                                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#8B6ED7] hover:bg-[#7354C4] rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-slate-700 text-sm leading-relaxed break-words">
                                  {discussion.text}
                                </p>
                              )}

                              <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                                <button
                                  onClick={() =>
                                    setActiveReplyId(activeReplyId === discussion._id ? null : discussion._id)
                                  }
                                  className="text-[11px] font-bold text-slate-500 hover:text-[#8B6ED7] transition-colors flex items-center gap-1 uppercase tracking-wider"
                                >
                                  Reply
                                </button>

                                <button
                                  onClick={() => handleToggleUpvote(discussion._id)}
                                  className={`text-[11px] font-bold transition-colors flex items-center gap-1.5 group/btn ${
                                    discussion.isUpvoted ? "text-[#8B6ED7]" : "text-slate-400 hover:text-[#8B6ED7]"
                                  }`}
                                >
                                  <svg
                                    className={`w-4 h-4 transition-colors ${
                                      discussion.isUpvoted ? "fill-[#8B6ED7]" : "group-hover/btn:fill-[#E6E6FA]"
                                    }`}
                                    fill={discussion.isUpvoted ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                                  </svg>
                                  {discussion.upvoteCount || 0}
                                </button>

                                {currentUserId === discussion.user?._id && (
                                  <div className="ml-auto flex items-center gap-3">
                                    <button
                                      onClick={() => {
                                        setEditingId(discussion._id);
                                        setEditText(discussion.text);
                                      }}
                                      className="text-[11px] font-bold text-slate-400 hover:text-[#8B6ED7] transition-colors flex items-center gap-1"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDiscussion(discussion._id)}
                                      className="text-[11px] font-bold text-rose-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <AnimatePresence>
                                {activeReplyId === discussion._id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 flex flex-col sm:flex-row gap-2 overflow-hidden"
                                  >
                                    <textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      className="flex-1 p-2 text-xs sm:text-sm border border-slate-200 rounded-lg outline-none resize-none focus:ring-2 focus:ring-[#8B6ED7] bg-slate-50 w-full"
                                      placeholder="Write a reply..."
                                      rows={1}
                                    />
                                    <div className="flex justify-end shrink-0">
                                      <button
                                        onClick={() => handleReplyDiscussion(discussion._id)}
                                        disabled={!replyText.trim()}
                                        className="px-4 py-1.5 bg-[#8B6ED7] text-white rounded-lg text-xs font-bold hover:bg-[#7354C4] disabled:opacity-50 transition-colors shadow-sm w-full sm:w-auto"
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Replies map */}
                              {discussion.replies && discussion.replies.map((reply) => (
                                <div key={reply._id} className="mt-4 flex gap-2 sm:gap-3 bg-slate-50/80 p-3 sm:p-4 rounded-xl border border-slate-100 shadow-sm transition-colors hover:bg-slate-50">
                                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B6ED7] shrink-0 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden uppercase shadow-sm">
                                    {reply.user.avatar.url ? (
                                      <img src={reply.user.avatar.url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      reply.user.name?.substring(0, 2) || "U"
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                      <span className="font-bold text-slate-900 text-xs hover:text-[#8B6ED7] transition-colors cursor-pointer break-words">
                                        {reply.user.name}
                                      </span>
                                      {reply.user.role === "instructor" && (
                                        <span className="bg-[#E6E6FA] text-[#7354C4] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                          Instructor
                                        </span>
                                      )}
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        {formatDate(reply.createdAt)}
                                      </span>
                                      {reply.isEdited && (
                                        <span className="text-[10px] text-slate-400 italic">
                                          (edited {formatDate(reply.editedAt)})
                                        </span>
                                      )}
                                    </div>

                                    {editingId === reply._id ? (
                                      <div className="mt-2 flex flex-col gap-2">
                                        <textarea
                                          value={editText}
                                          onChange={(e) => setEditText(e.target.value)}
                                          className="w-full p-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8B6ED7] outline-none resize-none bg-white"
                                          rows={2}
                                        />
                                        <div className="flex justify-end gap-2">
                                          <button
                                            onClick={() => setEditingId(null)}
                                            className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            onClick={() => handleEditSubmit(reply._id)}
                                            disabled={!editText.trim()}
                                            className="px-2.5 py-1 text-xs font-bold text-white bg-[#8B6ED7] hover:bg-[#7354C4] rounded-lg transition-colors disabled:opacity-50"
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                                        {reply.text}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                                      <button
                                        onClick={() => handleToggleUpvote(reply._id)}
                                        className={`text-[10px] font-bold transition-colors flex items-center gap-1.5 group/replybtn ${
                                          reply.isUpvoted ? "text-[#8B6ED7]" : "text-slate-400 hover:text-[#8B6ED7]"
                                        }`}
                                      >
                                        <svg
                                          className={`w-3.5 h-3.5 transition-colors ${
                                            reply.isUpvoted ? "fill-[#8B6ED7]" : "group-hover/replybtn:fill-[#E6E6FA]"
                                          }`}
                                          fill={reply.isUpvoted ? "currentColor" : "none"}
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                                        </svg>
                                        {reply.upvoteCount || 0}
                                      </button>

                                      {currentUserId === reply.user?._id && (
                                        <div className="ml-auto flex items-center gap-3">
                                          <button
                                            onClick={() => {
                                              setEditingId(reply._id);
                                              setEditText(reply.text);
                                            }}
                                            className="text-[10px] font-bold text-slate-400 hover:text-[#8B6ED7] transition-colors flex items-center gap-1"
                                          >
                                            <Pencil className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteDiscussion(reply._id)}
                                            className="text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {discussions.length === 0 && (
                        <div className="text-center py-10">
                          <MessageCircle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-500 text-sm font-medium">
                            Be the first to start a discussion!
                          </p>
                        </div>
                      )}
                      
                      {/* Invisible div for auto-scrolling to bottom */}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* New Post Input (Sticky at bottom) */}
                    <div className="shrink-0 p-4 border-t border-[#F4F0FA] bg-white z-10 w-full">
                      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex-col sm:flex-row items-stretch sm:items-start w-full">
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-gradient-to-br from-[#A388E8] to-[#B39DDB] shrink-0 items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm">
                          YOU
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="Ask a question or start a discussion..."
                            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#8B6ED7] outline-none resize-none bg-white transition-all focus:border-transparent"
                            rows={2}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={handlePostDiscussion}
                              disabled={!postText.trim()}
                              className="px-5 py-2 sm:px-6 bg-[#8B6ED7] text-white text-xs sm:text-sm rounded-lg font-bold hover:bg-[#7354C4] transition-all shadow-sm active:scale-95 disabled:opacity-50 w-full sm:w-auto"
                            >
                              Post Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showSidebar && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1 w-full max-w-full"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#F4F0FA] overflow-hidden sticky top-20 lg:top-24 max-h-[70vh] lg:max-h-[calc(100vh-8rem)] flex flex-col z-30">
                  <div className="p-5 border-b border-[#F4F0FA] bg-slate-50/50 shrink-0 w-full">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#8B6ED7]" />
                      Course Content
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">
                      {allLessons.length} lessons •{" "}
                      {user.role === "student" &&
                        `${Math.round(enrollment?.progress || 0)}% completed`}
                    </p>
                  </div>

                  <div className="overflow-y-auto flex-1 p-3 custom-scrollbar w-full">
                    {course?.sections?.map((section, sectionIdx) => (
                      <div key={section._id || sectionIdx} className="mb-5 w-full">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 rounded-lg mb-2 break-words">
                          {section.title}
                        </div>
                        <div className="space-y-1.5 w-full">
                          {section.lessons?.map((lesson, lessonIdx) => {
                            const isActive = currentLesson?._id === lesson._id;
                            const isCompleted = completedLessons.has(lesson._id?.toString());
                            return (
                              <button
                                key={lesson._id || lessonIdx}
                                onClick={() => selectLesson(lesson)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                                  isActive
                                    ? "bg-[#F4F0FA] border-[#E6E6FA] shadow-sm"
                                    : "hover:bg-slate-50 border-transparent"
                                } border`}
                              >
                                <div
                                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                                    isCompleted
                                      ? "bg-emerald-500 text-white"
                                      : isActive
                                      ? "bg-[#8B6ED7] text-white"
                                      : "bg-slate-200 text-slate-500"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  ) : (
                                    lessonIdx + 1
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`text-xs font-bold truncate ${
                                      isActive ? "text-[#4A3089]" : "text-slate-700"
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                    <Clock className="h-3 w-3" /> {lesson.duration}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative border border-[#E6E6FA]"
            >
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Rate this course
                </h3>
                <p className="text-sm text-slate-500 mt-1.5 font-medium">
                  Your feedback helps us improve.
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1.5 transition-transform active:scale-90"
                  >
                    <svg
                      className={`w-9 h-9 sm:w-11 sm:h-11 transition-all ${
                        (hoverRating || rating) >= star
                          ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                          : "text-slate-200 fill-none hover:text-amber-200 hover:fill-amber-100"
                      }`}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience (optional)..."
                className="w-full p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#8B6ED7] outline-none resize-none mb-6 min-h-[120px] bg-slate-50"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!rating}
                  className="flex-1 px-4 py-3 bg-[#8B6ED7] text-white rounded-xl font-bold hover:bg-[#7354C4] transition-colors disabled:opacity-50 text-sm order-1 sm:order-2 shadow-md shadow-[#D8BFD8]"
                >
                  {userReview ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningInterface;