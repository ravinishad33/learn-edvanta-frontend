import React from "react";
import {
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Star,
  Lock,
} from "lucide-react";

const CourseTable = ({ courses, role, onEdit, onDelete, onView }) => {
  const columns = {
    student: [
      "Course",
      "Instructor",
      "Progress",
      "Status",
      "Next Lesson",
      "Actions",
    ],
    instructor: [
      "Course",
      "Students",
      "Rating",
      "Status",
      "Revenue",
      "Actions",
    ],
    admin: [
      "Course",
      "Instructor",
      "Students",
      "Status",
      "Revenue",
      "Rating",
      "Actions",
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns[role]?.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id} className="hover:bg-gray-50">
                {/* Student Row */}
                {role === "student" && (
                  <>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {course?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course?.category?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course?.instructorId?.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-full rounded-full ${course.progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {course.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.nextLesson || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onView(course.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => console.log("Download", course.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <TrendingUp size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                )}

                {/* Instructor Row */}
                {role === "instructor" && (
                  <>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {course?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course?.category?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-gray-400" />
                        <span>{course?.enrolledStudents?.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star size={16} className="mr-2 text-yellow-500" />
                        <span>{course.rating}/5.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {course.visibility === "public" ? (
                          <CheckCircle
                            size={16}
                            className="mr-2 text-green-500"
                          />
                        ) : course.visibility === "private" ? (
                          <Lock size={16} className="mr-2 text-blue-500" />
                        ) : (
                          <XCircle size={16} className="mr-2 text-gray-400" />
                        )}
                        <span>
                          {course.visibility === "public"
                            ? "Published"
                            : course.visibility === "private"
                              ? "Private"
                              : "Draft"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-green-600">
                      ₹
                      {((course?.price || 0) - (course?.discountedPrice || 0)) *
                        (course?.enrolledStudents?.length || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(course.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => onView(course.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(course.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                )}

                {/* Admin Row */}
                {role === "admin" && (
                  <>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-gray-400" />
                        <span>{course.students}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : course.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600">
                      ${course.revenue}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star size={16} className="mr-2 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => console.log("Approve", course.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => onView(course.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(course.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;
