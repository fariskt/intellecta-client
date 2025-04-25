import { Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import WelcomePage from "./pages/WelcomePage";
import Assessment from "./pages/Assessment";
import AssessmentResults from "./pages/AssessmentResults";
import Home from "./pages/Home/Home";
import Programs from "./pages/Home/Programs";
import ProfilePage from "./pages/Profile";
import Courses from "./pages/Courses/Courses";
import Lessons from "./pages/Courses/Lessons/Lessons";
import GameProfile from "./pages/Gamefied/GamePages/GameProfile";
import AllGames from "./pages/Gamefied/GamePages/AllGames";
import GameLeaderboard from "./pages/Gamefied/GamePages/GameLeaderboard";
import MemoryGame from "./pages/Gamefied/Games/MemoryGame/MemoryGame";
import TicTacToe from "./pages/Gamefied/Games/Tictactoe/TicTacToe";
import GameHome from "./pages/Gamefied/GamePages/GameHome";
import GamesLayout from "./pages/Gamefied/GameLayout";
import ChatBot from "./components/Chatbot/ChatBot";
import GeographyQuiz from "./pages/Gamefied/Games/GeographyQuiz/GeographyQuiz";
import WordBuilder from "./pages/Gamefied/Games/WordBuilder/WordBuilder";
import UserDashLayout from "./pages/userDash.tsx/UserDashLayout";

import AdminLayout from "./pages/admin/AdminLayout";
import Admindashboard from "./pages/admin/Admindashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCoursesPage from "./pages/admin/AdminCourses";
import AddCourse from "./pages/admin/AddCourse";
import AdminCourseDetailsPage from "./pages/admin/AdminCourseDetails";

// import LessonContent from './pages/Courses/Lessons/LessonContent';
// import LessonQuiz from './pages/Courses/Lessons/LessonQuiz';
// import NumberNinja from './pages/Gamefied/Games/NumberNinja/NumberNija';
// import Notification from './pages/Notification';

// import AdminLogin from './pages/admin/AdminLogin';
import LessonContent from "./pages/Courses/Lessons/LessonContent";
import LessonQuiz from "./pages/Courses/Lessons/LessonQuiz";
import NumberNinja from "./pages/Gamefied/Games/NumberNinja/NumberNija";
import Notification from "./pages/Notification";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedAdminRoute from "./routes/AdminRoutes";
import ProtectedUserRoute from "./routes/UserRoutes";
import EditCourseForm from "./pages/admin/EditCourse/EditCourseForm";

function App() {
  return (
    <>
      <ChatBot />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route element={<ProtectedUserRoute />}>
        <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<Programs />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/courses/:category" element={<Courses />} />
          <Route path="/course/:category/:courseTitle/:id" element={<Lessons />} />
          <Route path="/lesson/:lessonTitle/:lessonId" element={<LessonContent />}/>
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/course/quiz/:courseId" element={<LessonQuiz />} />
          <Route path="/assessment-results" element={<AssessmentResults />} />
          <Route path="/userdash" element={<UserDashLayout />}></Route>

          <Route path="/games" element={<GamesLayout />}>
            <Route index element={<GameHome />} />
            <Route path="myprofile" element={<GameProfile />} />
            <Route path="allgames" element={<AllGames />} />
            <Route path="leaderboard" element={<GameLeaderboard />} />
            <Route path="memory_game" element={<MemoryGame />} />
            <Route path="word_builder" element={<WordBuilder />} />
            <Route path="tic_tac_toe" element={<TicTacToe />} />
            <Route path="geography_quiz" element={<GeographyQuiz />} />
            <Route path="number_ninja" element={<NumberNinja />} />
          </Route>
        </Route>

        <Route path="/admin_login" element={<AdminLogin />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admindashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="addCourse" element={<AddCourse />} />
            <Route path="courses/:courseId/edit" element={<EditCourseForm />} />
            <Route path="courses/:courseId" element={<AdminCourseDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
