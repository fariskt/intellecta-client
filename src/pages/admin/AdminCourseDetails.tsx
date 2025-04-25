// src/pages/admin/AdminCourseDetailsPage.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { fetchCourseDetails } from "./services/services";
import AllStudentsLoader from "../../utils/ui/allStudentsLoader";
import axiosInstance from "../../utils/axiosInstance";

interface Lesson {
  _id: string;
  title: string;
  // Add other lesson properties if needed (e.g., duration, content)
}

interface Course {
  _id: string;
  title: string;
  subject: string;
  description: string;
  gradeLevel?: number;
  thumbnail?: string;
}

interface CourseDetailsResponse {
  course: Course;
  lessons: Lesson[] | [];
}

const AdminCourseDetailsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseDetails(courseId!),
  });

  const handleDelete = async () => {
      try {
        const res = await axiosInstance.patch(`http://localhost:5005/api/courses/deleteCourse/${courseId}`);
        console.log("dddd ",res.data)
        navigate("/admin/courses");
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Failed to delete course");
      } finally {
        setIsDeleting(false);
      }
    
  };

  const handleEdit = () => {
    navigate(`/admin/courses/${courseId}/edit`);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-[75vh]">
          <AllStudentsLoader />
        </div>
      ) : (
        <div className="px-6 max-h-[85vh] overflow-y-auto relative scrollbar-hide">
          <div className="p-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate("/admin/courses")}
              className="flex items-center gap-2 font-bold text-lg text-gray-600 hover:text-gray-800 mb-6"
            >
              <ArrowLeft size={20} />
              Back to Courses
            </button>

            {/* Course Details Card */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-gray-800 overflow-hidden">
              {/* Thumbnail (first and full width) */}

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {data?.course?.title}
                  </h1>

                  <div className="flex gap-2">
                    <button
                      onClick={handleEdit}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`p-2 bg-red-500 text-white rounded hover:bg-red-600 ${
                        isDeleting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                {data?.course?.thumbnail && (
                  <img
                    src={data.course.thumbnail}
                    alt={`${data.course.title} thumbnail`}
                    className="w-full h-80 object-contain"
                  />
                )}
                {/* Course Information */}
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Subject
                    </h3>
                    <p className="text-lg text-gray-800 dark:text-gray-200">
                      {data?.course?.subject &&
                        data.course.subject.charAt(0).toUpperCase() +
                          data.course.subject.slice(1)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Grade Level
                    </h3>
                    <p className="text-lg text-gray-800 dark:text-gray-200">
                      {data?.course?.gradeLevel ?? "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {data?.course?.description || "No description available"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Number of Lessons
                    </h3>
                    <p className="text-lg text-gray-800 dark:text-gray-200">
                      {data?.lessons?.length || 0}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Lessons
                    </h3>
                    {data?.lessons && data.lessons.length > 0 ? (
                      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                        {data.lessons.map((lesson) => (
                          <li key={lesson._id}>{lesson.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">
                        No lessons available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCourseDetailsPage;
