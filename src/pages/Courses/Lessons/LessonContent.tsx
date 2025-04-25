/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import NavbarWelcome from "../../../components/Navbar/NavbarWelcome";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SpinningLoader from "../../../components/Loaders/SpinningLoader";
import { Lesson } from "../../../types";
import ReactPlayer from "react-player";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
} from "react-icons/fa";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import screenfull from "screenfull";
import { toast } from "react-toastify";

type Params = {
  lessonId: string;
  lessonTitle: string;
};

type ProgressData = {
  completedLessons: string[];
  courseId: string;
  currentLesson: string;
  progressPercent: number;
  _id: string;
};

const LessonContent = () => {
  const { lessonId = "" } = useParams<Params>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { courseTitle, courseId } = state || {};
  const queryClient = useQueryClient();

  // State for custom controls
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  // const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handlers for custom controls
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value, "fraction");
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
    setPlayedSeconds(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  const handleToggleMute = () => {
    setVolume(volume === 0 ? 0.8 : 0);
  };

  const handlePlaybackRateChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseFloat(e.target.value);
    setPlaybackRate(value);
  };

  const handleFullscreen = () => {
    if (screenfull.isEnabled && wrapperRef.current) {
      screenfull.toggle(wrapperRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Fetch course progress
  const fetchCourseProgress = async () => {
    if (!courseId) throw new Error("Course ID is missing");
    const response = await axios.get(
      `http://localhost:5005/api/progress/${courseId}`,
      { withCredentials: true }
    );
    return response.data.data;
  };

  const { data: progressData } = useQuery<ProgressData>({
    queryKey: ["courseProgress", courseId],
    queryFn: fetchCourseProgress,
    enabled: !!courseId,
  });

  // Fetch course with lessons
  const fetchCourseWithLessons = async () => {
    if (!courseId) throw new Error("Course ID is missing");
    const response = await axios.get(
      `http://localhost:5005/api/courses/${courseId}`
    );
    return response.data.data;
  };

  const {
    data: courseData,
    // isLoading: courseLoading,
    error: courseError,
  } = useQuery<{
    course: { _id: string; title: string; description: string };
    lessons: Lesson[];
  }>({
    queryKey: ["courseWithLessons", courseId],
    queryFn: fetchCourseWithLessons,
    enabled: !!courseId,
  });

  // Fetch lesson content
  const fetchLessonContent = async () => {
    const response = await axios.get(
      `http://localhost:5005/api/courses/lessons/${lessonId}`
    );
    return response.data.data;
  };

  const {
    data: lessonData,
    isLoading,
    error,
  } = useQuery<Lesson>({
    queryKey: ["lessonContent", lessonId],
    queryFn: fetchLessonContent,
    enabled: !!lessonId,
  });

  useEffect(() => {
    if (progressData && lessonId) {
      const completed = progressData.completedLessons.includes(lessonId);
      setIsLessonCompleted(completed);
    }
  }, [progressData, lessonId]);

  // Mutation for marking lesson as complete
  const markAsCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!lessonId || !courseId)
        throw new Error("Lesson or Course ID is missing");
      const response = await axios.post(
        `http://localhost:5005/api/progress/update`,
        {
          courseId,
          lessonId,
        },
        { withCredentials: true }
      );
      return response.data.data;
    },
    onSuccess: async (_data) => {
      toast.success("Lesson marked as complete!");
      setIsLessonCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["courseProgress", courseId] });
      queryClient.setQueryData(
        ["courseWithLessons", courseId],
        (oldData: any) => {
          if (!oldData) return oldData;
          const updatedLessons = oldData.lessons.map((lesson: any) =>
            lesson._id === lessonId ? { ...lesson, completed: true } : lesson
          );
          return {
            ...oldData,
            lessons: updatedLessons,
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error marking lesson as complete:", error);
      toast.error("Failed to mark lesson as complete. Please try again.");
    },
  });

  const handleMarkAsComplete = () => {
    markAsCompleteMutation.mutate();
  };

  const isVideoResource = (resource: any) => {
    return (
      resource.includes(".mp4") ||
      resource.includes(".webm") ||
      resource.includes("youtu.be") ||
      resource.includes("youtube.com")
    );
  };

  const getVideoCount = (lesson: Lesson) => {
    let videoCount = 0;
    if (lesson.url && isVideoResource(lesson.url)) {
      videoCount += 1;
    }
    if (lesson.resources && lesson.resources.length > 0) {
      videoCount += lesson.resources.filter((resource) =>
        isVideoResource(resource)
      ).length;
    }
    return videoCount;
  };

  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (error || courseError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-center text-sm sm:text-base md:text-lg text-red-600">
          Error loading content: {(error || courseError)?.message}
        </p>
      </div>
    );
  }

  if (!lessonData || !courseData) {
    return null;
  }

  const lessons = courseData.lessons || [];
  const notesContent = lessonData.notes || "No materials available";
  const additionalResources = lessonData.resources || [];
  const isLastLesson = lessons[lessons.length - 1]?._id === lessonId;

  const isCompletedLesson = (lesson: Lesson) => {
    if (!progressData) return false;
    return progressData.completedLessons.includes(lesson._id);
  };

  const handleQuiz = (courseId: string) => {
    const progress = progressData?.progressPercent ?? 0;

    if (progress >= 75) {
      navigate(`/course/quiz/${courseId}`);
    } else {
      toast.info(
        <span>
          Please complete at least <strong>75%</strong> of the course to access
          the quiz.
        </span>
      );
    }
  };

  return (
    <>
      <NavbarWelcome />
      {isLoading ? (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-50">
          <SpinningLoader />
          <p className="mt-12 text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center px-4">
            Loading Lesson Content. Please wait...!
          </p>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-200 py-4 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Sidebar Toggle Button */}
            <button
              className="lg:hidden mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm sm:text-base"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? "Hide Lessons" : "Show Lessons"}
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar: Lessons List */}
              <div
                className={`w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md space-y-4 ${
                  isSidebarOpen ? "block" : "hidden lg:block"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-300">
                  <h3 className="text-sm sm:text-base font-semibold">
                    Your Lessons
                  </h3>
                  <button
                    onClick={() =>
                      navigate(-1)
                    }
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 text-xs sm:text-sm"
                  >
                    Back
                  </button>
                </div>
                {lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="space-y-2">
                    <div
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        lessonData._id === lesson._id
                          ? "bg-green-100 border-2 border-green-500"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        const sanitizedTitle = lesson.title
                          .replace(/[^a-zA-Z0-9\s-]/g, "")
                          .replace(/\s+/g, "-");
                        navigate(`/lesson/${sanitizedTitle}/${lesson._id}`, {
                          state: { courseTitle, courseId },
                        });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-sm sm:text-base">
                          {isCompletedLesson(lesson) ? (
                            <IoCheckmarkCircleOutline />
                          ) : (
                            <FaPlay />
                          )}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold">
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700">
                        {getVideoCount(lesson)}
                      </span>
                    </div>
                    {lessonIndex < lessons.length - 1 && (
                      <hr className="border-t border-gray-300" />
                    )}
                  </div>
                ))}
                {isLastLesson && (
                  <button
                    onClick={() => handleQuiz(courseId)}
                    className="mt-4 block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm text-center"
                  >
                    Attempt Quiz
                  </button>
                )}
              </div>

              {/* Main Content */}
              <div className="w-full lg:w-3/4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {lessonData.title}
                  </h1>
                  <button
                    onClick={handleMarkAsComplete}
                    disabled={
                      isLessonCompleted || markAsCompleteMutation.isPending
                    }
                    className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto ${
                      isLessonCompleted || markAsCompleteMutation.isPending
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    } transition duration-300`}
                  >
                    {markAsCompleteMutation.isPending
                      ? "Marking..."
                      : isLessonCompleted
                      ? "Completed"
                      : "Mark as Complete"}
                  </button>
                </div>

                {lessonData.content && (
                  <div className="mt-4 sm:mt-6">
                    <div className="bg-gray-800 text-white p-3 sm:p-4 rounded-lg overflow-auto">
                      {lessonData.content.split("\n").map((para, index) => (
                        <p
                          key={index}
                          className="text-xs sm:text-sm md:text-base mb-2 sm:mb-3"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {lessonData.url && (
                  <div className="mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-xl font-bold mb-2">
                      Watch & Learn
                    </h2>
                    <div
                      className="relative bg-white rounded-lg shadow-md overflow-hidden"
                      ref={wrapperRef}
                    >
                      <div className="relative w-full aspect-video">
                        <ReactPlayer
                          url={lessonData.url}
                          width="100%"
                          height="100%"
                          controls={false}
                          playing={playing}
                          volume={volume}
                          playbackRate={playbackRate}
                          ref={playerRef}
                          onProgress={handleProgress}
                          onDuration={handleDuration}
                          onPlay={() => setPlaying(true)}
                          onPause={() => setPlaying(false)}
                          className="absolute top-0 left-0"
                          config={{
                            youtube: {
                              playerVars: {
                                showinfo: 0,
                                rel: 0,
                                modestbranding: 1,
                                iv_load_policy: 3,
                                controls: 0,
                              },
                            },
                          }}
                          light={true}
                          playIcon={
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                              <FaPlay className="text-white text-2xl sm:text-4xl" />
                            </div>
                          }
                        />
                      </div>
                      <div className="bg-gray-800 p-2 sm:p-3 flex flex-col space-y-2 text-white">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <button
                            onClick={handlePlayPause}
                            className="p-2 hover:bg-gray-700 rounded-full text-sm sm:text-base"
                            aria-label={playing ? "Pause" : "Play"}
                          >
                            {playing ? <FaPause /> : <FaPlay />}
                          </button>
                          <div className="flex-1 flex items-center w-full">
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step="any"
                              value={played}
                              onChange={handleSeek}
                              className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer"
                            />
                          </div>
                          <div className="text-xs sm:text-sm">
                            {formatTime(playedSeconds)} / {formatTime(duration)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleToggleMute}
                              className="p-2 hover:bg-gray-700 rounded-full text-sm sm:text-base"
                              aria-label={volume === 0 ? "Unmute" : "Mute"}
                            >
                              {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step="any"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-12 sm:w-16 h-1 bg-gray-600 rounded-lg cursor-pointer"
                            />
                          </div>
                          <button
                            onClick={handleFullscreen}
                            className="p-2 hover:bg-gray-700 rounded-full text-sm sm:text-base"
                            aria-label="Toggle fullscreen"
                          >
                            <FaExpand />
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
                          <div>
                            <span>Progress: {(played * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>Speed:</span>
                            <select
                              value={playbackRate}
                              onChange={handlePlaybackRateChange}
                              className="bg-gray-700 text-white rounded px-2 py-1 text-xs sm:text-sm"
                            >
                              <option value="0.5">0.5x</option>
                              <option value="1">1x</option>
                              <option value="1.5">1.5x</option>
                              <option value="2">2x</option>
                            </select>
                          </div>
                          <div>
                            <span>
                              Remaining: {formatTime(duration - playedSeconds)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {lessonData.type === "quiz" && lessonData.url && (
                  <div className="mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                      Quiz
                    </h2>
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                      <Link
                        to={`/course/quiz/${courseId}`}
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                      >
                        Take the Quiz
                      </Link>
                    </div>
                  </div>
                )}

                {lessonData.type === "exercise" && lessonData.url && (
                  <div className="mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                      Exercise
                    </h2>
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
                      <a
                        href={lessonData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                      >
                        View Exercise
                      </a>
                    </div>
                  </div>
                )}

                {!lessonData.url &&
                  !lessonData.content &&
                  !lessonData.resources && (
                    <p className="text-gray-600 text-xs sm:text-sm text-center mt-4">
                      No content available for this lesson yet.
                    </p>
                  )}

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                  <button
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold ${
                      activeTab === "notes"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-600 hover:text-white transition duration-300`}
                    onClick={() => setActiveTab("notes")}
                  >
                    Notes 📒
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold ${
                      activeTab === "resources"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-600 hover:text-white transition duration-300`}
                    onClick={() => setActiveTab("resources")}
                  >
                    Additional Resources 🔗
                  </button>
                </div>

                {activeTab === "notes" && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                      Notes 📖
                    </h2>
                    {lessonData.notes ? (
                      <a
                        href={notesContent}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs sm:text-sm font-semibold"
                      >
                        View Study Material (PDF)
                      </a>
                    ) : (
                      <p className="text-gray-600 text-xs sm:text-sm">
                        No materials available.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                      Additional Resources 🔗
                    </h2>
                    {additionalResources.length > 0 ? (
                      <div className="space-y-4">
                        {additionalResources.map((resource, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 sm:p-4 rounded-lg shadow-md"
                          >
                            {isVideoResource(resource) ? (
                              <div className="relative w-full aspect-video">
                                <ReactPlayer
                                  url={resource}
                                  width="100%"
                                  height="100%"
                                  controls={true}
                                  className="absolute top-0 left-0"
                                  config={{
                                    youtube: { playerVars: { showinfo: 1 } },
                                  }}
                                />
                              </div>
                            ) : (
                              <a
                                href={resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-xs sm:text-sm"
                              >
                                Resource {index + 1}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-xs sm:text-sm">
                        No resources available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LessonContent;
