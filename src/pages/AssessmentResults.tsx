import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const AssessmentResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state?.resultData?.assessmentResult;

  console.log("resultData", resultData);

  // If no result data, redirect back to assessment
  if (!resultData) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <p>No results available. Please complete the assessment.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4"
          onClick={() => navigate("/assessment")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    totalQuestions,
    correctCount,
    scorePercentage,
    weaknesses,
    aiResponse,
  } = resultData;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">
      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left - Progress Overview */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-white/30">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight">
            Overall Progress
          </h2>

          <div className="w-32 h-32 md:w-40 md:h-40">
            <CircularProgressbar
              value={scorePercentage}
              text={`${Math.round(scorePercentage)}%`}
              styles={buildStyles({
                textSize: "18px",
                pathColor:
                  scorePercentage <= 40
                    ? "#f87171"
                    : scorePercentage <= 74
                    ? "#facc15"
                    : "#34d399",
                textColor: "#1e293b",
                trailColor: "#e5e7eb",
                strokeLinecap: "round",
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-blue-900">
                {correctCount}
              </p>
              <p className="text-gray-700 font-medium">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-900">
                {totalQuestions}
              </p>
              <p className="text-gray-700 font-medium">Total</p>
            </div>
          </div>
        </div>

        {/* Right - AI Feedback & Insights */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-between space-y-6 text-gray-900">
          <div>
            <h3 className="text-xl font-semibold text-blue-800 mb-1 italic">
              Remarks
            </h3>
            <p className="text-green-600 font-medium italic">
              {aiResponse.motivationalNote}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-800 mb-1 italic">
              Areas to Improve
            </h3>
            <p className="text-red-500 font-medium italic">
              {weaknesses.length > 0
                ? weaknesses.join(", ").charAt(0).toUpperCase() +
                  weaknesses.join(", ").slice(1).toLowerCase()
                : "You're doing great! Keep going!"}
            </p>
          </div>

          {aiResponse.nextSteps?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-1 italic">
                Concentrate On
              </h3>
              <ul className="list-disc list-inside text-yellow-600 font-medium space-y-1">
                {aiResponse.nextSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {aiResponse.learningPaths?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-1 italic">
                AI Recommendations
              </h3>
              <ul className="list-decimal list-inside text-gray-800 space-y-1">
                {aiResponse.learningPaths.map((path, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-indigo-700">
                      {path.subject}
                    </span>{" "}
                    – {path.learningGoals[0]}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => navigate("/courses")}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg"
            >
              View Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
