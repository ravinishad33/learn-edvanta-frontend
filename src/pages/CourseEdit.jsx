import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiImage,
  FiVideo,
  FiChevronLeft,
  FiChevronRight,
  FiSave,
  FiTrash2,
  FiPlay,
  FiLoader,
  FiPlus,
  FiUpload,
  FiX,
  FiClock,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import {
  FileText,
  Globe,
  Image,
  Settings,
  BookOpen,
  Layers,
} from "lucide-react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const CourseEdit = () => {
  const  courseId = useParams().id;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [promoVideo, setPromoVideo] = useState(null);
  const [promoVideoPreview, setPromoVideoPreview] = useState("");
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentLessonPreview, setCurrentLessonPreview] = useState(null);
  const [originalCourse, setOriginalCourse] = useState(null);

 const apiUrl = import.meta.env.VITE_API_URL;


  // Upload states
  const [uploadingStates, setUploadingStates] = useState({
    thumbnail: false,
    promo: false,
    lessons: {}
  });
  const [uploadProgress, setUploadProgress] = useState({
    thumbnail: 0,
    promo: 0,
    lessons: {}
  });

  const videoRefs = useRef({});
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      level: "beginner",
      language: "english",
      priceType: "paid",
      price: 0,
      discountPrice: 0,
      visibility: "public",
      enrollmentType: "open",
      certificate: true,
      status: "draft",
    },
  });

  // Fetch categories
  useEffect(() => {
    const getCategory = async () => {
      try {
        const categoryRes = await axios.get(
          `${apiUrl}/api/category`
        );
        setCategories(categoryRes?.data);
      } catch (error) {
        console.error("Error fetching categories", error);
        toast.error("Failed to load categories");
      }
    };
    getCategory();
  }, [originalCourse]);


 

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${apiUrl}/api/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response?.data?.success) {
          const course = response?.data?.course;
          setOriginalCourse(course);
          // Set form values
          reset({
            title: course.title || "",
            description: course.description || "",
            category: course?.category?._id || "",
            subcategory: course?.subcategory?._id || "",
            level: course?.level || "beginner",
            language: course?.language || "english",
            priceType: course?.priceType || "paid",
            price: course?.price || 0,
            status:course?.status,
            discountPrice: course?.discountPrice || 0,
            visibility: course?.visibility || "public",
            enrollmentType: course?.enrollmentType || "open",
            certificate: course?.certificate || true,
          });

          // Set thumbnail
          if (course.thumbnail) {
            setThumbnail(course.thumbnail);
            setThumbnailPreview(course.thumbnail.url);
          }

          // Set promo video
          if (course.promotionalVideo) {
            setPromoVideo(course.promotionalVideo);
            setPromoVideoPreview(course.promotionalVideo.url);
          }

          // Set sections and lessons
          if (course.sections && course.sections.length > 0) {
            const formattedSections = course.sections.map((section) => ({
              id: section._id || `section-${Date.now()}-${Math.random()}`,
              _id: section._id, // Store original ID for update
              title: section.title || "",
              description: section.description || "",
              order: section.order || 1,
              lessons: section.lessons.map((lesson) => ({
                id: lesson._id || `lesson-${Date.now()}-${Math.random()}`,
                _id: lesson._id, // Store original ID for update
                title: lesson.title || "",
                description: lesson.description || "",
                video: lesson.video || null,
                videoPreview: lesson.video?.url || "",
                duration: parseDuration(lesson.duration),
                order: lesson.order || 1,
                isFree: lesson.isFree || false,
              })),
            }));
            setSections(formattedSections);
          }

          // toast.success("Course loaded successfully!");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course data");
        navigate("/instructor-dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, navigate, reset]);

  const formData = watch();
  const selectedCategory = formData?.category;

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const getSubCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${apiUrl}/api/subcategory/${selectedCategory}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubcategories(res.data);
      } catch (error) {
        console.error("Error fetching subcategories", error);
      }
    };
    getSubCategory();
  }, [selectedCategory]);



  // Parse duration from "MM:SS" or "HH:MM:SS" to seconds
  const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    
    // Handle "88 sec" format
    if (durationStr.includes('sec')) {
      return parseInt(durationStr) || 0;
    }
    
    const parts = durationStr.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

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

  const formatDisplayTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Steps configuration
  const steps = [
    { number: 1, title: "Basic Info", icon: FileText },
    { number: 2, title: "Course Media", icon: Image },
    { number: 3, title: "Curriculum", icon: Layers },
    { number: 4, title: "Settings", icon: Settings },
    { number: 5, title: "Review", icon: Globe },
  ];


// section 
  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      description: "",
      lessons: [],
      order: sections.length + 1,
    };
    setSections([...sections, newSection]);
    toast.success("New section added");
  };

  const updateSection = (sectionId, field, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const removeSection = (sectionId) => {
    if (sections.length > 1) {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      toast.success("Section removed");
    } else {
      toast.error("Course must have at least one section");
    }
  };

  const moveSection = (sectionId, direction) => {
    const index = sections.findIndex((s) => s.id === sectionId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    )
      return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + (direction === "up" ? -1 : 1)];
    newSections[index + (direction === "up" ? -1 : 1)] = temp;

    newSections.forEach((s, i) => (s.order = i + 1));
    setSections(newSections);
  };

// lessons 
  const addLesson = (sectionId) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newLesson = {
            id: `lesson-${Date.now()}`,
            title: `Lesson ${section.lessons.length + 1}`,
            description: "",
            video: null,
            videoPreview: "",
            duration: 0,
            order: section.lessons.length + 1,
            isFree: false,
          };
          return { ...section, lessons: [...section.lessons, newLesson] };
        }
        return section;
      })
    );
  };

  const updateLesson = (sectionId, lessonId, field, value) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: section.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            ),
          };
        }
        return section;
      })
    );
  };

  const removeLesson = (sectionId, lessonId) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const updatedLessons = section.lessons.filter(
            (l) => l.id !== lessonId
          );
          updatedLessons.forEach((l, i) => (l.order = i + 1));
          return { ...section, lessons: updatedLessons };
        }
        return section;
      })
    );
    toast.success("Lesson removed");
  };

  const moveLesson = (sectionId, lessonId, direction) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const index = section.lessons.findIndex((l) => l.id === lessonId);
          if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === section.lessons.length - 1)
          )
            return section;

          const newLessons = [...section.lessons];
          const temp = newLessons[index];
          newLessons[index] = newLessons[index + (direction === "up" ? -1 : 1)];
          newLessons[index + (direction === "up" ? -1 : 1)] = temp;

          newLessons.forEach((l, i) => (l.order = i + 1));
          return { ...section, lessons: newLessons };
        }
        return section;
      })
    );
  };


// thumbnail upload 
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploadingStates(prev => ({ ...prev, thumbnail: true }));
    setUploadProgress(prev => ({ ...prev, thumbnail: 0 }));

    try {
      const data = await uploadToCloudinary(
        file,
        "image",
        "courses/thumbnails",
        (percent) => {
          setUploadProgress(prev => ({ ...prev, thumbnail: percent }));
        }
      );

      setThumbnail({
        url: data.secure_url,
        publicId: data.public_id,
      });
      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      toast.error("Thumbnail upload failed");
      setThumbnailPreview(thumbnail?.url || "");
    } finally {
      setUploadingStates(prev => ({ ...prev, thumbnail: false }));
      setUploadProgress(prev => ({ ...prev, thumbnail: 0 }));
    }
  };

  const handlePromoVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPromoVideoPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploadingStates(prev => ({ ...prev, promo: true }));
    setUploadProgress(prev => ({ ...prev, promo: 0 }));

    try {
      const data = await uploadToCloudinary(
        file,
        "video",
        "courses/promos",
        (percent) => {
          setUploadProgress(prev => ({ ...prev, promo: percent }));
        }
      );

      setPromoVideo({
        url: data.secure_url,
        publicId: data.public_id,
      });
      toast.success("Promotional video uploaded successfully!");
    } catch (error) {
      toast.error("Video upload failed");
      setPromoVideoPreview(promoVideo?.url || "");
    } finally {
      setUploadingStates(prev => ({ ...prev, promo: false }));
      setUploadProgress(prev => ({ ...prev, promo: 0 }));
    }
  };

  const handleLessonVideoUpload = async (sectionId, lessonId, file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    const key = `${sectionId}-${lessonId}`;

    // Create preview URL and get duration
    const previewUrl = URL.createObjectURL(file);
    updateLesson(sectionId, lessonId, "videoPreview", previewUrl);

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.onloadedmetadata = () => {
      updateLesson(sectionId, lessonId, "duration", videoElement.duration);
    };
    videoElement.src = previewUrl;

    setUploadingStates(prev => ({
      ...prev,
      lessons: { ...prev.lessons, [key]: true }
    }));
    setUploadProgress(prev => ({
      ...prev,
      lessons: { ...prev.lessons, [key]: 0 }
    }));

    try {
      const data = await uploadToCloudinary(
        file,
        "video",
        "courses/lessons",
        (percent) => {
          setUploadProgress(prev => ({
            ...prev,
            lessons: { ...prev.lessons, [key]: percent }
          }));
        }
      );

      updateLesson(sectionId, lessonId, "video", {
        url: data.secure_url,
        publicId: data.public_id,
      });
      toast.success("Lesson video uploaded successfully!");
    } catch (error) {
      toast.error("Lesson video upload failed");
      const existingVideo = sections
        .find(s => s.id === sectionId)
        ?.lessons.find(l => l.id === lessonId)?.video;
      updateLesson(sectionId, lessonId, "videoPreview", existingVideo?.url || "");
    } finally {
      setUploadingStates(prev => ({
        ...prev,
        lessons: { ...prev.lessons, [key]: false }
      }));
      setUploadProgress(prev => ({
        ...prev,
        lessons: { ...prev.lessons, [key]: 0 }
      }));
    }
  };


  // course or video stats 
  const getTotalLessons = () => {
    return sections.reduce((total, section) => total + section.lessons.length, 0);
  };

  const getTotalDuration = () => {
    let totalSeconds = 0;
    sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        totalSeconds += lesson.duration || 0;
      });
    });

    if (totalSeconds < 60) return `${Math.round(totalSeconds)} sec`;
    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }
    return `${minutes} min`;
  };

// navigation 
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
        if (sections.length === 0) {
          toast.error("Please add at least one section");
          isValid = false;
        } else {
          const totalLessons = getTotalLessons();
          if (totalLessons === 0) {
            toast.error("Please add at least one lesson");
            isValid = false;
          } else {
            let hasIncomplete = false;
            sections.forEach((section) => {
              section.lessons.forEach((lesson) => {
                if (!lesson.title || !lesson.video) {
                  hasIncomplete = true;
                }
              });
            });
            if (hasIncomplete) {
              toast.error("Please complete all lessons (title and video required)");
              isValid = false;
            }
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


// handle update or edit course 
  const onSubmit = async (data) => {
    if (!thumbnail?.url) {
      toast.error("Please upload thumbnail first");
      return;
    }

    setSubmitting(true);

    try {
      const readyToPublish = isReadyToPublish();

      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory || null,
        level: data.level,
        language: data.language,
        priceType: data.priceType,
        price: data.price,
        discountPrice: data.discountPrice,
        enrollmentType: data.enrollmentType,
        certificate: data.certificate,
        visibility: data.visibility,
        status: readyToPublish ? data.status : "draft",
        thumbnail: thumbnail,
        promotionalVideo: promoVideo?.url ? promoVideo : null,
        sections: sections.map((section) => ({
          ...(section._id && { _id: section._id }), // Include _id for existing sections
          title: section.title,
          description: section.description,
          order: section.order,
          lessons: section.lessons.map((lesson) => ({
            ...(lesson._id && { _id: lesson._id }), // Include _id for existing lessons
            title: lesson.title,
            description: lesson.description,
            video: lesson.video,
            duration: formatTime(lesson.duration),
            order: lesson.order,
            isFree: lesson.isFree || false,
          })),
        })),
        totalLessons: getTotalLessons(),
        totalDuration: getTotalDuration(),
      };

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${apiUrl}/api/course/${courseId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Course updated successfully!");
        setTimeout(() => navigate("/instructor-dashboard"), 1500);
      }
    } catch (error) {
      console.error("Course update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update course.");
    } finally {
      setSubmitting(false);
    }
  };

  const isReadyToPublish = () => {
    if (!formData.title || !formData.description || !formData.category) return false;
    if (!thumbnail?.url) return false;
    if (sections.length === 0) return false;

    let hasValidLesson = false;
    for (const section of sections) {
      if (!section.title) return false;
      for (const lesson of section.lessons) {
        if (!lesson.title || !lesson.video?.url) return false;
        hasValidLesson = true;
      }
    }
    return hasValidLesson;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/instructor-dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
              <p className="text-gray-600 mt-2">
                Update your course details and content
              </p>
            </div>
          </div>
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
                  {currentStep >= step.number ? (
                    "✓"
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm text-gray-500">Step {step.number}</div>
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
          {/* Main Form */}
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
                          message: "Description must be at least 100 characters",
                        },
                      })}
                      rows="5"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${errors.description ? "border-red-500" : "border-gray-300"}`}
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
                          ${errors.category ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Select Category</option>
                        {categories?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category?.name}
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
                        {subcategories.map((sub) => (
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
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="gujarati">Gujarati</option>
                        <option value="marathi">Marathi</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Course Thumbnail *
                    </label>

                    {thumbnailPreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        
                        {uploadingStates.thumbnail && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-blue-600 flex items-center gap-2">
                                <FiLoader className="animate-spin" />
                                Uploading...
                              </span>
                              <span className="text-sm font-medium">
                                {uploadProgress.thumbnail}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.thumbnail}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex justify-center gap-3">
                          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                            Change Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailUpload}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnail(null);
                              setThumbnailPreview("");
                            }}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <label className="cursor-pointer block">
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
                            <div className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
                              Select File
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Promotional Video */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Promotional Video (Optional)
                    </label>

                    {promoVideoPreview ? (
                      <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden bg-black">
                          <video
                            src={promoVideoPreview}
                            controls
                            className="w-full max-h-64"
                          />
                        </div>

                        {uploadingStates.promo && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-purple-600 flex items-center gap-2">
                                <FiLoader className="animate-spin" />
                                Uploading...
                              </span>
                              <span className="text-sm font-medium">
                                {uploadProgress.promo}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.promo}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-center gap-3">
                          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                            Change Video
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handlePromoVideoUpload}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setPromoVideo(null);
                              setPromoVideoPreview("");
                            }}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                        <label className="cursor-pointer block">
                          <div className="space-y-3">
                            <FiVideo className="w-12 h-12 text-gray-400 mx-auto" />
                            <div>
                              <p className="text-lg font-medium text-gray-700">
                                Upload Promotional Video
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                MP4, WebM or MOV • Max 100MB
                              </p>
                            </div>
                            <div className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block">
                              Select Video
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handlePromoVideoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Curriculum */}
              {currentStep === 3 && (
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Course Curriculum
                    </h2>
                    <button
                      type="button"
                      onClick={addSection}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FiPlus /> Add Section
                    </button>
                  </div>

                  {sections.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                      <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No sections yet
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Start by adding sections to organize your course. Each
                        section can contain multiple lessons.
                      </p>
                      <button
                        type="button"
                        onClick={addSection}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Create First Section
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sections.map((section) => (
                        <div
                          key={section.id}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                          {/* Section Header */}
                          <div className="bg-gray-50 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveSection(section.id, "up")}
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveSection(section.id, "down")}
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                >
                                  ↓
                                </button>
                              </div>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) =>
                                  updateSection(section.id, "title", e.target.value)
                                }
                                className="font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                                placeholder="Section Title"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {section.lessons.length} lessons
                              </span>
                              <button
                                type="button"
                                onClick={() => addLesson(section.id)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Add Lesson"
                              >
                                <FiPlus />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSection(section.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Remove Section"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>

                          {/* Lessons */}
                          <div className="p-4 space-y-3">
                            {section.lessons.length === 0 ? (
                              <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                                <p className="text-gray-500 text-sm">
                                  No lessons in this section
                                </p>
                                <button
                                  type="button"
                                  onClick={() => addLesson(section.id)}
                                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                  Add your first lesson
                                </button>
                              </div>
                            ) : (
                              section.lessons.map((lesson) => {
                                const uploadKey = `${section.id}-${lesson.id}`;
                                const isUploading = uploadingStates.lessons[uploadKey];
                                const progress = uploadProgress.lessons[uploadKey] || 0;

                                return (
                                  <div
                                    key={lesson.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                  >
                                    <div className="flex items-start gap-3">
                                      {/* Lesson Number */}
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="text-sm font-medium text-gray-500">
                                          {lesson.order}
                                        </span>
                                        <div className="flex flex-col">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              moveLesson(section.id, lesson.id, "up")
                                            }
                                            className="text-gray-400 hover:text-gray-600"
                                          >
                                            ↑
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              moveLesson(section.id, lesson.id, "down")
                                            }
                                            className="text-gray-400 hover:text-gray-600"
                                          >
                                            ↓
                                          </button>
                                        </div>
                                      </div>

                                      {/* Lesson Content */}
                                      <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={lesson.title}
                                            onChange={(e) =>
                                              updateLesson(
                                                section.id,
                                                lesson.id,
                                                "title",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Lesson Title"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          />
                                          {lesson.duration > 0 && (
                                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                              <FiClock />{" "}
                                              {formatDisplayTime(lesson.duration)}
                                            </span>
                                          )}
                                        </div>

                                        <textarea
                                          value={lesson.description}
                                          onChange={(e) =>
                                            updateLesson(
                                              section.id,
                                              lesson.id,
                                              "description",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Lesson description (optional)"
                                          rows="2"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />

                                        {/* Video Upload & Preview */}
                                        <div className="space-y-2">
                                          {(lesson.videoPreview || lesson.video?.url) ? (
                                            <div className="space-y-2">
                                              <div className="relative rounded-lg overflow-hidden bg-black">
                                                <video
                                                  ref={(el) => (videoRefs.current[lesson.id] = el)}
                                                  src={lesson.videoPreview || lesson.video?.url}
                                                  controls
                                                  className="w-full max-h-40"
                                                />
                                              </div>
                                              
                                              {isUploading && (
                                                <div className="mt-2">
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-blue-600 flex items-center gap-2">
                                                      <FiLoader className="animate-spin" />
                                                      Uploading...
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                      {progress}%
                                                    </span>
                                                  </div>
                                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                      style={{ width: `${progress}%` }}
                                                    />
                                                  </div>
                                                </div>
                                              )}

                                              <div className="flex items-center justify-between">
                                                <span className="text-sm text-green-600 flex items-center gap-1">
                                                  <FiCheckCircle /> Video uploaded
                                                </span>
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    updateLesson(section.id, lesson.id, "video", null);
                                                    updateLesson(section.id, lesson.id, "videoPreview", "");
                                                  }}
                                                  className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                  Remove
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <>
                                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                                <label className="cursor-pointer block">
                                                  <FiUpload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                                  <p className="text-sm text-gray-600">
                                                    Upload Lesson Video
                                                  </p>
                                                  <p className="text-xs text-gray-400 mt-1">
                                                    MP4, max 500MB
                                                  </p>
                                                  <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={(e) => {
                                                      const file = e.target.files[0];
                                                      if (file) {
                                                        handleLessonVideoUpload(
                                                          section.id,
                                                          lesson.id,
                                                          file
                                                        );
                                                      }
                                                    }}
                                                    className="hidden"
                                                  />
                                                </label>
                                              </div>

                                              {isUploading && (
                                                <div className="mt-2">
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-blue-600 flex items-center gap-2">
                                                      <FiLoader className="animate-spin" />
                                                      Uploading...
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                      {progress}%
                                                    </span>
                                                  </div>
                                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                      style={{ width: `${progress}%` }}
                                                    />
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </div>

                                        {/* Preview Lesson Button */}
                                        {(lesson.videoPreview || lesson.video?.url) && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setCurrentLessonPreview({
                                                title: lesson.title,
                                                videoUrl: lesson.videoPreview || lesson.video?.url,
                                              });
                                            }}
                                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                          >
                                            <FiPlay /> Preview Lesson
                                          </button>
                                        )}
                                      </div>

                                      {/* Remove Lesson Button */}
                                      <button
                                        type="button"
                                        onClick={() => removeLesson(section.id, lesson.id)}
                                        className="p-1 text-red-600 hover:text-red-800"
                                        title="Remove Lesson"
                                      >
                                        <FiX />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Curriculum Summary */}
                  {sections.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-blue-800">
                          <strong>Total:</strong> {sections.length} sections,{" "}
                          {getTotalLessons()} lessons • {getTotalDuration()}
                        </div>
                        <div className="text-xs text-blue-600">
                          Videos will be processed automatically
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
                          <input
                            type="number"
                            step="0.01"
                            min="1"
                            {...register("price", { min: 1 })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Price (Optional)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register("discountPrice")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
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
                      className="h-5 w-5 text-blue-600 rounded cursor-pointer"
                      id="issueCert"
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700 cursor-pointer" htmlFor="issueCert">
                      Issue completion certificate
                    </label>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Review & Update
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
                              {categories.find((c) => c._id === formData.category)
                                ?.name || "No category"}
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
                            {sections.length}
                          </div>
                          <div className="text-sm text-gray-600">Sections</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {getTotalLessons()}
                          </div>
                          <div className="text-sm text-gray-600">Lessons</div>
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
                          <div className="text-sm text-gray-600">Visibility</div>
                        </div>
                      </div>
                    </div>

                    {/* Sections Preview */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Curriculum Preview
                      </h4>
                      <div className="space-y-3">
                        {sections.map((section, idx) => (
                          <div key={section.id}>
                            <div className="flex items-center gap-2 font-medium text-gray-700">
                              <BookOpen className="w-4 h-4" />
                              <span>
                                Section {idx + 1}: {section.title}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({section.lessons.length} lessons)
                              </span>
                            </div>
                            {section.lessons.length > 0 && (
                              <div className="ml-6 mt-1 space-y-1">
                                {section.lessons.map((lesson, lessonIdx) => (
                                  <div
                                    key={lesson.id}
                                    className="text-sm text-gray-600 flex items-center gap-2"
                                  >
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <span>
                                      {lesson.order}. {lesson.title}
                                    </span>
                                    {lesson.duration > 0 && (
                                      <span className="text-xs text-gray-400">
                                        ({formatDisplayTime(lesson.duration)})
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Ready to Update?
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
                          { label: "Thumbnail uploaded", complete: !!thumbnail },
                          {
                            label: "At least one section",
                            complete: sections.length > 0,
                          },
                          {
                            label: "At least one lesson with video",
                            complete: sections.some((s) =>
                              s.lessons.some((l) => l.video)
                            ),
                          },
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
                                item.complete ? "text-gray-900" : "text-gray-500"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1 || submitting}
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
                    disabled={submitting || !isReadyToPublish()}
                    className={`px-8 py-3 rounded-lg flex items-center justify-center gap-2 font-medium
                      ${
                        submitting || !isReadyToPublish()
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="animate-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        <FiSave /> Update Course
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar Preview */}
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
                    <div className="text-gray-500">Sections</div>
                    <div className="font-medium">{sections.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Lessons</div>
                    <div className="font-medium">{getTotalLessons()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium">{getTotalDuration()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Level</div>
                    <div className="font-medium capitalize">
                      {formData.level}
                    </div>
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
                    { label: "Curriculum", step: 3 },
                    { label: "Settings", step: 4 },
                    { label: "Review", step: 5 },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
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
                  <FiCheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Organize content into logical sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Keep lessons under 15 minutes each</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Add descriptions to each lesson</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Preview your course before publishing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lesson Preview Modal */}
        {currentLessonPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {currentLessonPreview.title}
                </h3>
                <button
                  onClick={() => setCurrentLessonPreview(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX />
                </button>
              </div>
              <video
                src={currentLessonPreview.videoUrl}
                controls
                className="w-full rounded-lg"
                autoPlay
              />
            </div>
          </div>
        )}

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
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isReadyToPublish()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEdit;