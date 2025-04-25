import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import NavbarWelcome from "../../../components/Navbar/NavbarWelcome";
import { FaPlay } from "react-icons/fa";
import CircularProgress from "../../../utils/ui/Progress";
import { useState } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Lesson } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import SpinningLoader from "../../../components/Loaders/SpinningLoader";
import axios from "axios";

type Params = {
  id: string;
  courseTitle: string;
  category:string;
};

type ProgressData = {
  completedLessons: string[];
  courseId: string;
  createdAt: string;
  currentLesson: string;
  lastUpdated: string;
  progressPercent: number;
  updatedAt: string;
  userId: string;
  __v: number;
  _id: string;
};

const Lessons = () => {
  const { id = "", courseTitle = "",category= "" } = useParams<Params>();
  const navigate = useNavigate();

  const fetchCourseProgress = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5005/api/progress/${id}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err) {
      console.warn(`Progress not found for course ${id}`);
      throw err;
    }
  };

  const fetchCourseWithLessons = async () => {
    const response = await axios.get(`http://localhost:5005/api/courses/${id}`);
    return response.data.data;
  };

  const { data, isLoading } = useQuery<{
    course: { _id: string; title: string; description: string };
    lessons: Lesson[];
  }>({
    queryKey: ["courseWithLessons", id],
    queryFn: fetchCourseWithLessons,
    enabled: !!id,
  });

  const { data: progressData } =
    useQuery<ProgressData>({
      queryKey: ["courseProgress", id],
      queryFn: fetchCourseProgress,
      enabled: !!id,
    });

  const [selectLesson, setSelectLesson] = useState<Lesson | null>(null);
  const realLesson = data?.lessons || [];

  const chooseLesson = (lesson: Lesson) => {
    setSelectLesson(lesson);
    const sanitizedTitle = lesson.title
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    navigate(`/lesson/${sanitizedTitle}/${lesson._id}`, {
      state: { courseTitle, courseId: id },
    });
  };


  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center px-4">
  //       <p className="text-center text-sm sm:text-base md:text-lg text-red-600">
  //         Error loading courses: {error.message}
  //       </p>
  //     </div>
  //   );
  // }

  // if (!data) {
  //   return null;
  // }

  const isLessonCompleted = (lessonId: string) => {
    return progressData?.completedLessons?.includes(lessonId) || false;
  };

  return (
    <>
      <NavbarWelcome />
      {isLoading ? <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-50">
        <SpinningLoader />
        <p className="mt-12 text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center px-4">
          Loading your Lessons. Please wait...!
        </p>
      </div>: 
      <div className="min-h-screen bg-gray-100 py-4 px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center py-4 px-4 sm:px-6 border-b border-gray-300 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              className="text-xl sm:text-3xl text-gray-700 hover:text-gray-900"
              onClick={() => navigate(`/courses/${category}`)}
              aria-label="Go back"
            >
              <IoArrowBack className="text-black" />
            </button>
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              {data?.course.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 mt-3 sm:mt-0">
            <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
              {progressData?.completedLessons?.length || 0}/{realLesson.length}
            </span>
            <div className="bg-gray-300 w-24 sm:w-32 md:w-44 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: progressData ? `${progressData.progressPercent}%` : "0%",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto mt-6 sm:mt-8 flex flex-col lg:flex-row gap-6">
          {/* Course Info and Video */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Course Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4">
              <h3 className="text-sm sm:text-base font-bold pb-2 border-b border-gray-300">
                COURSE
              </h3>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-xl font-semibold text-center sm:text-left">
                    {data?.course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">
                    {data?.course.description}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center">
                  <CircularProgress
                    percentage={Math.round(progressData?.progressPercent || 0)}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md space-y-4">
              <h3 className="text-sm sm:text-base font-bold pb-2 border-b border-gray-300">
              SMART LEARNING, STARTS HERE !
              </h3>
              <div className="w-full">
                <video
                  className="w-full h-auto rounded-lg aspect-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/366278579992174595.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-sm sm:text-base font-bold pb-2 border-b border-gray-300">
                LESSONS
              </h3>
              <div className="mt-4 space-y-2">
                {realLesson.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    onClick={() => chooseLesson(lesson)}
                    className={`flex items-center justify-between rounded-lg p-3 border-2 cursor-pointer transition-all duration-200 ${
                      selectLesson?._id === lesson._id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                        {index + 1}.
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold">
                        {lesson.title}
                      </h3>
                    </div>
                    <span
                      className={`text-lg sm:text-xl ${
                        isLessonCompleted(lesson._id)
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {isLessonCompleted(lesson._id) ? (
                        <IoCheckmarkCircleOutline />
                      ) : (
                        <FaPlay className="text-black" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
};

export default Lessons;