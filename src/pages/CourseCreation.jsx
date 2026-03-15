// pages/CourseCreation.jsx
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import {
  FiImage,
  FiVideo,
  FiChevronLeft,
  FiChevronRight,
  FiSave,
  FiTrash2,
  FiPlay,
  FiLoader,

  FiScissors,
  FiEdit,
} from "react-icons/fi";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { useNavigate } from "react-router-dom";
import { FileText, Globe, Image,Settings, Video } from "lucide-react";

const CourseCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [mainVideo, setMainVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [promoVideo, setPromoVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const videoRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const mainVideoInputRef = useRef(null);
  const manualStartTimeRef = useRef(null);
  const manualDurationRef = useRef(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      level: "beginner",
      language: "english",
      priceType: "paid",
      price: 49.99,
      discountPrice: 0,
      visibility: "draft",
      enrollmentType: "open",
      certificate: true,
    },
  });

  useEffect(() => {
    const getCategory = async () => {
      try {
        const token = localStorage.getItem("token"); // or wherever you store it

        const categoryRes = await axios.get(
          "http://localhost:5000/api/category"
        );
        setCategories(categoryRes.data);
        // console.log(categoryRes.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    getCategory();
  }, []);

  const formData = watch();
  const selectedCategory = formData.category;

  // =============== REQUIRED FUNCTIONS ===============

  // Format time from seconds to MM:SS or HH:MM:SS
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Format time for display (more readable)
  const formatDisplayTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Parse time string (MM:SS or HH:MM:SS) to seconds
  const parseTime = (timeString) => {
    if (!timeString) return 0;

    const parts = timeString.split(":").map(Number);
    if (parts.length === 3) {
      // HH:MM:SS format
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS format
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // SS format
      return parts[0];
    }
    return 0;
  };

  // Handle promotional video upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPromoVideo(file);
      setVideoPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success("Promotional video uploaded successfully!");
          return 0;
        }
        return prev + 10;
      });
    }, 50);
  };

  // Add lesson from current timestamp
  const addLessonFromTimestamp = () => {
    const newLesson = {
      id: Date.now(),
      title: `Lesson ${lessons.length + 1}`,
      description: "",
      startTime: formatTime(currentTime),
      duration: "00:00",
      videoUrl: videoPreview,
      order: lessons.length + 1,
      previewUrl: null,
    };
    setLessons([...lessons, newLesson]);
    toast.success(
      `Lesson ${lessons.length + 1} added at ${formatDisplayTime(currentTime)}`,
    );
  };

  // Add manual lesson
  const addManualLesson = () => {
    if (!manualStartTimeRef.current || !manualDurationRef.current) return;

    const startTime = manualStartTimeRef.current.value;
    const duration = manualDurationRef.current.value;

    if (!startTime || !duration) {
      toast.error("Please enter both start time and duration");
      return;
    }

    // Validate time format
    const timeRegex = /^([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{2}$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(duration)) {
      toast.error("Please use format MM:SS or HH:MM:SS");
      return;
    }

    const newLesson = {
      id: Date.now(),
      title: `Lesson ${lessons.length + 1}`,
      description: "",
      startTime,
      duration,
      videoUrl: videoPreview,
      order: lessons.length + 1,
      previewUrl: null,
    };
    setLessons([...lessons, newLesson]);

    // Clear inputs
    manualStartTimeRef.current.value = "";
    manualDurationRef.current.value = "";

    toast.success("Manual lesson added");
  };

  // Set lesson time from current video position
  const setLessonTimeFromVideo = (index) => {
    const updatedLessons = [...lessons];
    updatedLessons[index].startTime = formatTime(currentTime);
    setLessons(updatedLessons);
    toast.success(`Start time set to ${formatDisplayTime(currentTime)}`);
  };

  // Calculate lesson duration automatically
  const calculateLessonDuration = (index) => {
    const updatedLessons = [...lessons];
    const currentLesson = updatedLessons[index];
    const nextLesson = updatedLessons[index + 1];

    if (nextLesson) {
      // Calculate duration based on next lesson's start time
      const currentTime = parseTime(currentLesson.startTime);
      const nextTime = parseTime(nextLesson.startTime);
      const duration = nextTime - currentTime;

      if (duration > 0) {
        updatedLessons[index].duration = formatTime(duration);
        setLessons(updatedLessons);
        toast.success(`Duration calculated: ${formatDisplayTime(duration)}`);
      } else {
        toast.error("Invalid duration - next lesson starts earlier");
      }
    } else {
      // Last lesson - duration to end of video
      const currentTime = parseTime(currentLesson.startTime);
      const duration = videoDuration - currentTime;

      if (duration > 0) {
        updatedLessons[index].duration = formatTime(duration);
        setLessons(updatedLessons);
        toast.success(`Duration calculated: ${formatDisplayTime(duration)}`);
      } else {
        toast.error("Invalid duration - exceeds video length");
      }
    }
  };

  // Play lesson segment
  const playLessonSegment = (index) => {
    const lesson = lessons[index];
    const startSeconds = parseTime(lesson.startTime);

    if (videoRef.current && startSeconds < videoDuration) {
      videoRef.current.currentTime = startSeconds;
      videoRef.current.play();
      setIsPlaying(true);
      toast.success(`Playing lesson ${index + 1} from ${lesson.startTime}`);
    } else {
      toast.error("Invalid start time");
    }
  };

  // Adjust lesson duration (auto-set next lesson start time)
  const adjustLessonDuration = (index) => {
    const updatedLessons = [...lessons];
    const currentLesson = updatedLessons[index];
    const nextLesson = updatedLessons[index + 1];

    if (nextLesson) {
      const currentStart = parseTime(currentLesson.startTime);
      const duration = parseTime(currentLesson.duration);
      const newStartTime = currentStart + duration;

      if (newStartTime < videoDuration) {
        updatedLessons[index + 1].startTime = formatTime(newStartTime);
        setLessons(updatedLessons);
        toast.success("Next lesson start time adjusted");
      } else {
        toast.error("Duration exceeds video length");
      }
    } else {
      toast.error("No next lesson to adjust");
    }
  };

  // Update lesson
  const updateLesson = (index, field, value) => {
    const updatedLessons = [...lessons];
    updatedLessons[index][field] = value;
    setLessons(updatedLessons);
  };

  // Remove lesson
  const removeLesson = (index) => {
    if (lessons.length > 0) {
      const updatedLessons = lessons.filter((_, i) => i !== index);
      // Update order numbers
      updatedLessons.forEach((lesson, i) => (lesson.order = i + 1));
      setLessons(updatedLessons);
      toast.success("Lesson removed");
    }
  };

  // Generate preview URL for a lesson segment
  const generateLessonPreview = (index) => {
    const lesson = lessons[index];
    const startTime = parseTime(lesson.startTime);
    const duration = parseTime(lesson.duration);

    if (startTime + duration > videoDuration) {
      toast.error("Lesson exceeds video length");
      return;
    }

    // In real app, this would generate a clip from the main video
    // For now, just mark that preview is available
    const updatedLessons = [...lessons];
    updatedLessons[index].previewUrl = `preview-generated-${Date.now()}`;
    setLessons(updatedLessons);
    toast.success("Lesson preview generated");
  };

  // Calculate total course duration from lessons
  const getTotalDuration = () => {
    if (lessons.length === 0) return "0 sec";

    let totalSeconds = 0;

    lessons.forEach((lesson) => {
      totalSeconds += parseTime(lesson.duration);
    });

    // Less than 1 minute → seconds
    if (totalSeconds < 60) {
      return `${totalSeconds} sec`;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes} min` : `${hours}h`;
    }

    return `${minutes} min`;
  };

  // Sort lessons by start time
  const sortLessons = () => {
    const sorted = [...lessons].sort((a, b) => {
      return parseTime(a.startTime) - parseTime(b.startTime);
    });

    // Update order numbers
    sorted.forEach((lesson, index) => {
      lesson.order = index + 1;
    });

    setLessons(sorted);
    toast.success("Lessons sorted by start time");
  };

  // Validate lessons (check for overlaps)
  const validateLessons = () => {
    const sortedLessons = [...lessons].sort(
      (a, b) => parseTime(a.startTime) - parseTime(b.startTime),
    );

    for (let i = 0; i < sortedLessons.length - 1; i++) {
      const currentLesson = sortedLessons[i];
      const nextLesson = sortedLessons[i + 1];

      const currentEnd =
        parseTime(currentLesson.startTime) + parseTime(currentLesson.duration);
      const nextStart = parseTime(nextLesson.startTime);

      if (currentEnd > nextStart) {
        toast.error(`Lesson ${i + 1} overlaps with Lesson ${i + 2}`);
        return false;
      }
    }

    toast.success("All lessons are properly timed");
    return true;
  };

  // =============== EXISTING FUNCTIONS ===============

  // Update subcategories when category changes
  useEffect(() => {
    // console.log(selectedCategory)
    if (!selectedCategory) return;

    const getSubCategory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/subcategory/${selectedCategory}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setSubcategories(res.data);
        // console.log(res.data)
      } catch (error) {
        console.error("Error fetching subcategories", error);
      }
    };

    getSubCategory();
  }, [selectedCategory]);

  // Steps configuration
  const steps = [
    { number: 1, title: "Basic Info", icon: FileText },
    { number: 2, title: "Media", icon: Image },
    { number: 3, title: "Video & Lessons", icon: Video },
    { number: 4, title: "Settings", icon: Settings },
    { number: 5, title: "Publish", icon: Globe },
  ];

  // upload thumbanail to cloudinary
  const handleFileUpload = async (file, type) => {
    if (!file) return null;
    setUploading(true);
    setUploadProgress(0);

    // Show preview for images
    if (type === "image") {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }

    try {
      // Upload to Cloudinary
      const folder = type === "image" ? "courses/thumbnails" : "courses/videos";

      const data = await uploadToCloudinary(file, type, folder, (percent) => {
        setUploadProgress(percent);
      });

      // Save uploaded file info in state
      if (type === "image") {
        setThumbnail({
          url: data.secure_url,
          publicId: data.public_id,
        });
      } else if (type === "video") {
        setVideo({
          url: data.secure_url,
          publicId: data.public_id,
        });
      }

      toast.success(
        `${type === "image" ? "Image" : "Video"} uploaded successfully!`,
      );
      console.log(data);
      return data.secure_url; // optional, can return if needed
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed. Try again!");
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // upload mainVideo to cloudinary
  const handleMainVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Create preview and get duration
    const reader = new FileReader();
    reader.onload = (e) => {
      const videoSrc = e.target.result;
      setVideoPreview(videoSrc);

      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        setVideoDuration(videoElement.duration);
      };
      videoElement.src = videoSrc;
    };
    reader.readAsDataURL(file);

    try {
      // Upload to Cloudinary
      const data = await uploadToCloudinary(
        file,
        "video",
        "courses/videos",
        (percent) => {
          setUploadProgress(percent);
        },
      );
      console.log(data);
      // Save uploaded video info in state
      setMainVideo({
        url: data.secure_url,
        publicId: data.public_id,
      });

      toast.success("Main video uploaded successfully!");
    } catch (error) {
      console.error("Video upload failed:", error);
      toast.error("Video upload failed. Try again!");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file, "image");
    } else {
      toast.error("Please select an image file");
    }
  };

  // Navigation
  const nextStep = async () => {
    let isValid = true;

    switch (currentStep) {
      case 1:
        isValid = await trigger(["title", "description", "category", "level"]);
        break;
      case 2:
        if (!thumbnail) {
          toast.error("Please upload a thumbnail image");
          isValid = false;
        }
        break;
      case 3:
        if (!mainVideo) {
          toast.error("Please upload the main course video");
          isValid = false;
        } else if (lessons.length === 0) {
          toast.error("Please add at least one lesson");
          isValid = false;
        } else {
          const incompleteLessons = lessons.filter(
            (lesson) => !lesson.title || !lesson.startTime || !lesson.duration,
          );
          if (incompleteLessons.length > 0) {
            toast.error(
              "Please complete all lessons (title, start time, and duration)",
            );
            isValid = false;
          }

          // Validate lesson timing
          if (!validateLessons()) {
            isValid = false;
          }
        }
        break;
    }

    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Form submission  course creation
  const onSubmit = async (data) => {
    if (!thumbnail?.url || !mainVideo?.url) {
      toast.error("Please upload thumbnail and main video first");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...data,
        videoDuration: formatTime(videoDuration),
        totalDuration: getTotalDuration(),
        totalLessons: lessons.length,
        lessons: lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          startTime: lesson.startTime,
          duration: lesson.duration,
          order: lesson.order,
        })),
        thumbnail, // { url, publicId }
        video: mainVideo, // { url, publicId }
        promotionalVideo: promoVideo || null, // optional
      };

      const token = localStorage.getItem("token");
      // console.log(payload)

      const response = await axios.post(
        "http://localhost:5000/api/course",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(payload)
      // console.log("API response:", response.data);
      toast.success("Course created successfully!");

      setTimeout(() => {
        navigate("/instructor-dashboard");
      }, 2000); // 2 seconds

      //  reset form feild
      setCurrentStep(1);
      setThumbnail(null);
      setThumbnailPreview("");
      setMainVideo(null);
      setVideoPreview("");
      setVideoDuration(0);
      setLessons([]);
      setIsPlaying(false);
      setCurrentTime(0);
      setPromoVideo(null);

      // Reset form fields
      const resetFields = [
        "title",
        "description",
        "category",
        "subcategory",
        "price",
      ];
      resetFields.forEach((field) => setValue(field, ""));
      setValue("price", 49.99);
    } catch (error) {
      console.error("Course creation failed:", error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if ready to publish
  const isReadyToPublish = () => {
    return (
      formData.title &&
      formData.description &&
      formData.category &&
      thumbnail &&
      mainVideo &&
      lessons.length > 0 &&
      lessons.every(
        (lesson) => lesson.title && lesson.startTime && lesson.duration,
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge with the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center space-x-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${
                    currentStep >= step.number
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep >= step.number ? "✓" : <step.icon/>}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm text-gray-500">
                    Step {step.number}
                  </div>
                  <div
                    className={`font-medium ${
                      currentStep >= step.number
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
                {step.number < 5 && (
                  <div className="hidden md:block w-16 h-0.5 bg-gray-300 ml-4" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Progress Bar */}
          <div className="mt-4 md:hidden">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of 5</span>
              <span>{Math.round((currentStep / 5) * 100)}% Complete</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - Left 2/3 */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Course Information
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      {...register("title", {
                        required: "Course title is required",
                        minLength: {
                          value: 10,
                          message: "Title must be at least 10 characters",
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${errors.title ? "border-red-500" : "border-gray-300"}`}
                      placeholder="e.g., Complete Web Development Bootcamp 2024"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Make it descriptive and appealing to students
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 100,
                          message:
                            "Description must be at least 100 characters",
                        },
                      })}
                      rows="5"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${
                          errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      placeholder="Describe what students will learn in this course..."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        {...register("category", {
                          required: "Category is required",
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          ${
                            errors.category
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory
                      </label>
                      <select
                        {...register("subcategory")}
                        disabled={!selectedCategory}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((sub, index) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level *
                      </label>
                      <select
                        {...register("level")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="all">All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        {...register("language")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="hindi">Hindi</option>
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Media */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Course Media
                  </h2>

                  {/* Thumbnail Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label
                          htmlFor="thumbnail-upload"
                          className="block text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Course Thumbnail *
                        </label>
                        <p className="text-sm text-gray-500">
                          This image will represent your course
                        </p>
                      </div>
                      {thumbnail && (
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnail(null);
                            setThumbnailPreview("");
                          }}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {thumbnailPreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="mt-3 text-center">
                          <label
                            htmlFor="thumbnail-upload-change"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            Change Image
                          </label>
                          <input
                            id="thumbnail-upload-change"
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <div className="space-y-3">
                          <FiImage className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-700">
                              Upload Course Thumbnail
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              JPG, PNG, GIF or WebP • Max 5MB
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Recommended: 1280×720px
                            </p>
                          </div>
                          <label
                            htmlFor="thumbnail-upload"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            Select File
                          </label>
                        </div>
                        <input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </div>
                    )}

                    {uploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Uploading...
                          </span>
                          <span className="text-sm font-medium">
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Promotional Video */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label
                          htmlFor="video-upload"
                          className="block text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Promotional Video (Optional)
                        </label>
                        <p className="text-sm text-gray-500">
                          A short video to attract students
                        </p>
                      </div>
                      {promoVideo && (
                        <button
                          type="button"
                          onClick={() => {
                            setPromoVideo(null);
                            setVideoPreview("");
                          }}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {videoPreview ? (
                      <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden bg-black">
                          <video
                            ref={videoRef}
                            src={videoPreview}
                            controls
                            className="w-full max-h-64"
                          />
                          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Preview
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <label
                            htmlFor="video-upload-change"
                            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            Change Video
                          </label>
                          <input
                            id="video-upload-change"
                            type="file"
                            accept="video/*"
                            ref={thumbnailInputRef}
                            onChange={handleVideoChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                        <div className="space-y-3">
                          <FiVideo className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-700">
                              Upload Promotional Video
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              MP4, WebM or MOV • Max 100MB
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              HD quality recommended
                            </p>
                          </div>
                          <label
                            htmlFor="video-upload"
                            className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
                          >
                            Select Video
                          </label>
                        </div>
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          ref={mainVideoInputRef}
                          onChange={handleVideoChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Video & Lessons with Timestamps */}
              {currentStep === 3 && (
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Course Video & Lessons
                  </h2>

                  {/* Main Video Upload Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Upload Main Course Video *
                        </label>
                        <p className="text-sm text-gray-500">
                          Upload one long video for the entire course. You'll
                          create lessons by marking timestamps.
                        </p>
                      </div>
                      {mainVideo && (
                        <button
                          type="button"
                          onClick={() => {
                            setMainVideo(null);
                            setVideoPreview("");
                            setVideoDuration(0);
                            setLessons([]);
                          }}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Video
                        </button>
                      )}
                    </div>

                    {videoPreview ? (
                      <div className="space-y-4">
                        {/* Video Player */}
                        <div className="relative rounded-lg overflow-hidden bg-black">
                          <video
                            ref={videoRef}
                            src={videoPreview}
                            controls
                            className="w-full max-h-96"
                            onLoadedMetadata={(e) => {
                              setVideoDuration(e.target.duration);
                            }}
                            onTimeUpdate={(e) => {
                              setCurrentTime(e.target.currentTime);
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Duration: {formatTime(videoDuration)}
                          </div>
                        </div>

                        {/* Video Controls for Lesson Creation */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600">
                                Current: {formatTime(currentTime)}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (videoRef.current) {
                                    videoRef.current.currentTime =
                                      currentTime - 5;
                                  }
                                }}
                                className="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                              >
                                -5s
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (videoRef.current) {
                                    videoRef.current.currentTime =
                                      currentTime + 5;
                                  }
                                }}
                                className="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                              >
                                +5s
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={addLessonFromTimestamp}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <FiScissors /> Add Lesson at Current Time
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <label className="cursor-pointer block">
                          <div className="space-y-3">
                            <FiVideo className="w-12 h-12 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-lg font-medium text-gray-700">
                                Upload Complete Course Video
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                MP4, WebM or MOV • Max 2GB
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Upload one video for the entire course. You'll
                                split it into lessons using timestamps.
                              </p>
                            </div>
                            <div className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
                              Select Video File
                            </div>
                          </div>
                          {/* Fix: Make sure the input has the onChange handler properly attached */}
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleMainVideoUpload}
                            className="hidden"
                            id="main-video-upload"
                          />
                        </label>
                      </div>
                    )}

                    {uploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Uploading...
                          </span>
                          <span className="text-sm font-medium">
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lessons Management Section */}
                  {videoPreview && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                          Lessons from Video
                        </h3>
                        <div className="text-sm text-gray-600">
                          {lessons.length} lessons • Total:{" "}
                          {formatTime(videoDuration)}
                        </div>
                      </div>

                      {lessons.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                          <FiScissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            No lessons created yet
                          </h4>
                          <p className="text-gray-500 max-w-md mx-auto">
                            Play the video above and click "Add Lesson at
                            Current Time" to create lessons.
                          </p>
                          <div className="mt-4 text-sm text-gray-400">
                            Tip: You can also manually add lessons with specific
                            start times.
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {lessons.map((lesson, index) => (
                            <div
                              key={lesson.id}
                              className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-start space-x-3">
                                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg font-bold">
                                    {index + 1}
                                  </div>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={lesson.title}
                                      onChange={(e) =>
                                        updateLesson(
                                          index,
                                          "title",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Lesson Title"
                                      className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                                    />
                                    <textarea
                                      value={lesson.description}
                                      onChange={(e) =>
                                        updateLesson(
                                          index,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Lesson description..."
                                      rows="2"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeLesson(index)}
                                  className="p-2 text-red-600 hover:text-red-800"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                  </label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={lesson.startTime}
                                      onChange={(e) =>
                                        updateLesson(
                                          index,
                                          "startTime",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="00:00"
                                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setLessonTimeFromVideo(index)
                                      }
                                      className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm"
                                    >
                                      Set from Video
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                  </label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={lesson.duration}
                                      onChange={(e) =>
                                        updateLesson(
                                          index,
                                          "duration",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="00:00"
                                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        calculateLessonDuration(index)
                                      }
                                      className="px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 text-sm"
                                    >
                                      Calculate
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => playLessonSegment(index)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                  >
                                    <FiPlay /> Preview
                                  </button>
                                  {index < lessons.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        adjustLessonDuration(index)
                                      }
                                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                                    >
                                      Adjust
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Lesson Preview */}
                              {lesson.previewUrl && (
                                <div className="mt-3 border-t border-gray-100 pt-3">
                                  <div className="text-sm text-gray-600 mb-2">
                                    Lesson Preview:
                                  </div>
                                  <video
                                    src={lesson.previewUrl}
                                    controls
                                    className="w-full rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Manual Lesson Creation */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Add Lesson Manually
                            </h4>
                            <p className="text-sm text-gray-600">
                              Specify start time and duration
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Start Time (MM:SS)"
                                className="px-3 py-2 border border-gray-300 rounded-lg w-32"
                                ref={manualStartTimeRef}
                              />
                              <input
                                type="text"
                                placeholder="Duration (MM:SS)"
                                className="px-3 py-2 border border-gray-300 rounded-lg w-32"
                                ref={manualDurationRef}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={addManualLesson}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <FiScissors className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-900">
                              How to Create Lessons:
                            </h4>
                            <ul className="mt-2 text-sm text-blue-800 space-y-1">
                              <li>
                                1. Play the video and pause at lesson start
                                point
                              </li>
                              <li>2. Click "Add Lesson at Current Time"</li>
                              <li>3. Fill in lesson title and description</li>
                              <li>
                                4. Adjust start time and duration as needed
                              </li>
                              <li>
                                5. Use "Preview" to verify each lesson segment
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Settings */}
              {currentStep === 4 && (
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Course Settings
                  </h2>

                  {/* Pricing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Pricing
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer">
                        <input
                          type="radio"
                          {...register("priceType")}
                          value="paid"
                          className="h-5 w-5 text-blue-600"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            Paid Course
                          </div>
                          <div className="text-sm text-gray-500">
                            Charge students for access
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer">
                        <input
                          type="radio"
                          {...register("priceType")}
                          value="free"
                          className="h-5 w-5 text-blue-600"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            Free Course
                          </div>
                          <div className="text-sm text-gray-500">
                            Make it accessible to everyone
                          </div>
                        </div>
                      </label>
                    </div>

                    {formData.priceType === "paid" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">
                              ₹
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="1"
                              {...register("price", { min: 1 })}
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Price (Optional)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">
                              ₹
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              {...register("discountPrice")}
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Access Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Access Settings
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Visibility
                        </label>
                        <select
                          {...register("visibility")}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="draft">Draft (Only you)</option>
                          <option value="private">Private (Invite only)</option>
                          <option value="public">Public</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enrollment
                        </label>
                        <select
                          {...register("enrollmentType")}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="open">Open Enrollment</option>
                          <option value="approval">Requires Approval</option>
                          <option value="invite">Invite Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Certificate */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("certificate")}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700">
                      Issue completion certificate
                    </label>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Review & Publish
                  </h2>

                  <div className="space-y-6">
                    {/* Course Summary */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {thumbnailPreview && (
                          <img
                            src={thumbnailPreview}
                            alt="Course thumbnail"
                            className="w-32 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {formData.title || "Untitled Course"}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {categories.find(
                                (c) => c._id === formData.category,
                              )?.name || "No category"}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full capitalize">
                              {formData.level}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                              {getTotalDuration()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {lessons.length}
                          </div>
                          <div className="text-sm text-gray-600">Lessons</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {formData.priceType === "free"
                              ? "Free"
                              : `₹${formData.price}`}
                          </div>
                          <div className="text-sm text-gray-600">Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {getTotalDuration()}
                          </div>
                          <div className="text-sm text-gray-600">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600 capitalize">
                            {formData.visibility}
                          </div>
                          <div className="text-sm text-gray-600">
                            Visibility
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Ready to Publish?
                      </h4>

                      <div className="space-y-3">
                        {[
                          {
                            label: "Title and description filled",
                            complete: formData.title && formData.description,
                          },
                          {
                            label: "Category selected",
                            complete: formData.category,
                          },
                          { label: "Thumbnail uploaded", complete: thumbnail },
                          {
                            label: "At least one lesson",
                            complete: lessons.length > 0,
                          },
                          {
                            label: "All lessons have videos",
                            complete: lessons.every((l) => l.videoUrl),
                          },
                          { label: "Pricing configured", complete: true },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div
                              className={`flex items-center justify-center w-6 h-6 rounded-full mr-3
                              ${
                                item.complete
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {item.complete ? "✓" : "○"}
                            </div>
                            <span
                              className={`text-sm ${
                                item.complete
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="space-y-3">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          required
                          className="h-5 w-5 text-blue-600 rounded mt-1"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          I confirm that I have the rights to publish this
                          content and it complies with our terms of service.
                        </span>
                      </label>

                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-blue-600 rounded mt-1"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          This course meets quality standards with clear audio,
                          HD video, and structured content.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1 || loading}
                  className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium
                    ${
                      currentStep === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  <FiChevronLeft /> Previous
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                  >
                    Continue <FiChevronRight />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !isReadyToPublish()}
                    className={`px-8 py-3 rounded-lg flex items-center justify-center gap-2 font-medium
                      ${
                        loading || !isReadyToPublish()
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin" /> Publishing...
                      </>
                    ) : (
                      <>
                        <FiSave /> Publish Course
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar Preview - Right 1/3 */}
          <div className="space-y-6">
            {/* Course Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Course Preview
              </h3>

              <div className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Course preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-lg truncate">
                    {formData.title || "Your Course Title"}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {formData.description?.substring(0, 100) ||
                      "Course description will appear here..."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Category</div>
                    <div className="font-medium truncate">
                      {categories.find((c) => c._id === formData.category)
                        ?.name || "Not set"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Level</div>
                    <div className="font-medium capitalize">
                      {formData.level}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium">{getTotalDuration()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Lessons</div>
                    <div className="font-medium">{lessons.length}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Progress</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium">
                      {Math.round((currentStep / 5) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Basic Info", step: 1 },
                    { label: "Media", step: 2 },
                    { label: "Lessons", step: 3 },
                    { label: "Settings", step: 4 },
                    { label: "Review", step: 5 },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span
                        className={`text-sm ${
                          currentStep >= item.step
                            ? "text-green-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {item.label}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center
                        ${
                          currentStep >= item.step
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {currentStep >= item.step ? "✓" : index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    i
                  </div>
                  <span>Use HD videos (720p or higher)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    i
                  </div>
                  <span>Keep lessons under 15 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    i
                  </div>
                  <span>Add practice exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    i
                  </div>
                  <span>Preview before publishing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-lg flex items-center gap-1
                ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <FiChevronLeft /> Back
            </button>

            <div className="text-sm text-gray-600">Step {currentStep} of 5</div>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={!isReadyToPublish()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreation;
