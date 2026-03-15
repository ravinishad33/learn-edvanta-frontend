import React from "react";
import {
  BookOpen,
  Users,
  Star,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const CourseCard = ({ course, role, onDelete }) => {
  // const {}

  const navigate = useNavigate();

  const onEdit = (courseId) => {
    navigate(`/mycourses/edit/${courseId}`);
  };

  const onView = (courseId) => {
    navigate(`/mycourses/learn/${courseId}`);
  };

  // learn/1

  const getStatusBadge = (visibility) => {
    const statusMap = {
      public: {
        label: "Published",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      private: {
        label: "Private",
        color: "bg-blue-100 text-blue-800",
        icon: Lock,
      },
      draft: {
        label: "Draft",
        color: "bg-gray-100 text-gray-800",
        icon: Clock,
      },
    };

    const statusConfig = statusMap[visibility] || statusMap?.public;
    const Icon = statusConfig.icon;

    return (
      <span
        className={`${statusConfig.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}
      >
        <Icon size={12} />
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
      {/* Course Header */}
      <div className={`${course.color || "bg-blue-500"} h-32 relative`}>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">
            {course?.title || "title"}
          </h3>
          <p className="text-white/90 text-sm">
            {course?.category?.name || course.category}
          </p>
        </div>
        <div className="absolute top-4 right-4">
          {getStatusBadge(course?.visibility)}
        </div>
      </div>
      {/* {console.log(course.courseId?.lessons[0].description)} */}
      {/* Course Content */}
      <div className="p-6">
        {/* Student View */}
        {role === "student" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {/* Instructor: {course?.instructor || ""} */}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {course.enrolledAt
                    ? new Date(course.enrolledAt).toLocaleString()
                    : "-"}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${course.progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            {
              // course.nextLesson
              true && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Next:</strong>
                    {/* {course.nextLesson} */}
                    {/* {console.log(course.courseId._id)} */}
                    {course.courseId?.lessons[0].description}
                    React Hooks
                  </p>
                  {course.deadline && (
                    <p className="text-xs text-blue-600 mt-1">
                      Deadline: {course.deadline}
                    </p>
                  )}
                </div>
              )
            }

            <button
              onClick={() => onView(course.courseId._id)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {course.progress === 100 ? "Review Course" : "Continue Learning"}
            </button>
          </>
        )}

        {/* Instructor View */}
        {role === "instructor" && (
          <>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm">
                    {course?.enrolledStudents?.length} students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm">{course.rating || 5}/5.0</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-gray-400" />
                  <span className="text-sm">
                    {course?.lessons?.length} lessons
                  </span>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  ₹
                  {((course?.price || 0) - (course?.discountedPrice || 0)) *
                    (course?.enrolledStudents?.length || 0)}{" "}
                  Revenue
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(course._id)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={onView}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View
              </button>
            </div>
          </>
        )}

        {/* Admin View */}
        {role === "admin" && (
          <>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm">
                    Instructor: {course.instructor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm">{course.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm">{course.students} enrolled</span>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  ${course.revenue}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Created: {course.createdAt}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => console.log("Approve", course.id)}
                className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition"
              >
                Approve
              </button>
              <button
                onClick={onView}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Details
              </button>
              <button
                onClick={onDelete}
                className="px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
