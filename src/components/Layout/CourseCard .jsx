// import React from "react";
// import {
//   BookOpen,
//   Users,
//   Star,
//   Calendar,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Edit,
//   Trash2,
//   Eye,
//   XCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const CourseCard = ({ course, role, onDelete, onApprove, onReject }) => {
//   const navigate = useNavigate();

//   const onEdit = (courseId) => {
//     navigate(`/mycourses/edit/${courseId}`);
//   };

//   const onView = (courseId) => {
//     navigate(`/mycourses/learn/${courseId}`);
//   };

//   // download certificate
//   const handleDownloadCertificate = async (courseId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         `http://localhost:5000/api/certificate/download/course/${courseId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       const downloadUrl = response.data.downloadUrl;

//       // Create an invisible <a> element to trigger download
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = `certificate-${courseId}.png`; // optional file name
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.log("Download failed:", error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       draft: {
//         label: "Draft",
//         color: "bg-gray-100 text-gray-800",
//         icon: Clock,
//       },
//       review: {
//         label: "For Review",
//         color: "bg-yellow-100 text-yellow-800",
//         icon: Eye,
//       },
//       published: {
//         label: "Published",
//         color: "bg-green-100 text-green-800",
//         icon: CheckCircle,
//       },
//       rejected: {
//         label: "Rejected",
//         color: "bg-red-100 text-red-800",
//         icon: XCircle,
//       },
//     };

//     const statusConfig = statusMap[status] || statusMap.draft;
//     const Icon = statusConfig.icon;

//     return (
//       <span
//         className={`${statusConfig.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}
//       >
//         <Icon size={12} />
//         {statusConfig.label}
//       </span>
//     );
//   };

//   return (
//     <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
//       {/* Course Header */}
//       <div className={`${course?.color || "bg-blue-500"} h-32 relative`}>
//         <div className="absolute bottom-4 left-4">
//           <h3 className="text-xl font-bold text-white">
//             {course?.title || "title"}
//           </h3>
//           <p className="text-white/90 text-sm">
//             {course?.category?.name || course?.category}
//           </p>
//         </div>
//         <div className="absolute top-4 right-4">
//           {getStatusBadge(course?.status)}
//         </div>
//       </div>

//       {/* Course Content */}
//       <div className="p-6">
//         {/* Student View */}
//         {role === "student" && (
//           <>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <Users size={16} className="text-gray-400" />
//                 <span className="text-sm text-gray-600">
//                   Instructor: {course?.instructor?.name}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar size={16} className="text-gray-400" />
//                 <span className="text-sm text-gray-600">
//                   {course?.enrollment?.createdAt
//                     ? new Date(course?.enrollment?.createdAt).toLocaleString()
//                     : "-"}
//                 </span>
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div className="mb-4">
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Progress</span>
//                 <span>{course?.enrollment?.progress}%</span>
//               </div>
//               <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div
//                   className={`h-full ${
//                     course?.enrollment?.progress === 100
//                       ? "bg-green-500"
//                       : "bg-blue-500"
//                   }`}
//                   style={{ width: `${course?.enrollment?.progress}%` }}
//                 />
//               </div>
//             </div>

//             {/* Next Lesson */}
//             {course?.progress === 100 ? (
//               <div className="bg-blue-50 p-3 rounded-lg mb-4">
//                 <p
//                   onClick={() => handleDownloadCertificate(course?._id)}
//                   className="text-sm text-green-800 cursor-pointer"
//                 >
//                   <strong>Download Certificate</strong>
//                 </p>
//               </div>
//             ) : course?.nextLesson ? (
//               <div className="bg-blue-50 p-3 rounded-lg mb-4">
//                 <p className="text-sm text-blue-800">
//                   <strong>Next: </strong> {course?.nextLesson?.title}
//                 </p>
//                 {/* {course.deadline && (
//       <p className="text-xs text-blue-600 mt-1">Deadline: {course.deadline}</p>
//     )} */}
//               </div>
//             ) : (
//               <div className="bg-blue-50 p-3 rounded-lg mb-4">
//                 <p className="text-sm text-blue-800">Course in progress...</p>
//                 {/* {course.deadline && (
//       <p className="text-xs text-blue-600 mt-1">Deadline: {course.deadline}</p>
//     )} */}
//               </div>
//             )}

//             <button
//               onClick={() => onView(course?._id)}
//               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               {course?.enrollment?.progress === 100
//                 ? "Review Course"
//                 : "Continue Learning"}
//             </button>
//           </>
//         )}

//         {/* Instructor View */}
//         {role === "instructor" && (
//           <>
//             <div className="space-y-3 mb-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Users size={16} className="text-gray-400" />
//                   <span className="text-sm">
//                     {course?.enrolledStudents?.length} students
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Star size={16} className="text-yellow-500" />
//                   <span className="text-sm">
//                     {course.averageRating || 0}/5.0
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <BookOpen size={16} className="text-gray-400" />
//                   <span className="text-sm">
//                     {course?.totalLessons || course?.sections?.length} lessons
//                   </span>
//                 </div>
//                 <div className="text-sm font-semibold text-green-600">
//                   ₹
//                   {((course?.price || 0) - (course?.discountPrice || 0)) *
//                     (course?.enrolledStudents?.length || 0)}{" "}
//                   Revenue
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => onEdit(course?._id)}
//                 className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
//               >
//                 <Edit size={16} />
//                 Edit
//               </button>
//               <button
//                 onClick={() => onView(course?._id)}
//                 className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
//               >
//                 <Eye size={16} />
//                 View
//               </button>
//               <button
//                 onClick={() => onDelete(course?._id)}
//                 className="px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </>
//         )}

//         {/* Admin View */}
//         {role === "admin" && (
//           <>
//             <div className="space-y-3 mb-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Users size={16} className="text-gray-400" />
//                   <span className="text-sm">
//                     Instructor: {course?.instructor?.name || ""}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Star size={16} className="text-yellow-500" />
//                   <span className="text-sm">{course?.averageRating || 0}</span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Users size={16} className="text-gray-400" />
//                   <span className="text-sm">
//                     {course?.enrolledStudents} students
//                   </span>
//                 </div>
//                 <div className="text-sm font-semibold text-green-600">
//                   ₹ {course?.revenue}
//                 </div>
//               </div>
//               <div className="text-sm text-gray-500">
//                 Created:{" "}
//                 <span>
//                   {course?.createdAt &&
//                     new Date(course?.createdAt)
//                       .toLocaleString("en-GB", {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "2-digit",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: false,
//                       })
//                       .replace(",", "")}
//                 </span>
//               </div>
//             </div>

//             <div className="flex gap-2">
//               {/* Admin: Approve / Reject if review */}
//               {course?.status === "review" && (
//                 <>
//                   <button
//                     onClick={() => onApprove(course._id)}
//                     className="flex-1 py-2 flex items-center justify-center gap-1 rounded-lg transition bg-green-100 text-green-700 hover:bg-green-200"
//                   >
//                     <CheckCircle size={16} />
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => onReject(course._id)}
//                     className="flex-1 py-2 flex items-center justify-center gap-1 rounded-lg transition bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
//                   >
//                     <AlertCircle size={16} />
//                     Reject
//                   </button>
//                 </>
//               )}

//               {/* Details always */}
//               <button
//                 onClick={() => onView(course._id)}
//                 className="flex-1 py-2 flex items-center justify-center gap-1 rounded-lg transition bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 <Eye size={16} />
//                 Details
//               </button>

//               {/* Delete always */}
//               <button
//                 onClick={() => onDelete(course._id)}
//                 className="px-3 py-2 rounded-lg transition bg-red-100 text-red-700 hover:bg-red-200"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseCard;
