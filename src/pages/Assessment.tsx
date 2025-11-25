import { useState, useEffect } from "react";
import WcNavbar from "../components/Navbar/NavbarWelcome";
import { IoCheckmarkOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import SpinningLoader from "../components/Loaders/SpinningLoader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define an interface for the question structure
interface AssessmentQuestion {
  _id: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
}

const Assessment = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchAssessmentQuestions = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching assessment questions");
        const response = await axios.get(import.meta.env.VITE_ASSESSMENT_URL, { withCredentials: true});
        console.log('Assessment Questions Response:', response.data.questions);

        const transformedQuestions = response.data.questions.map((q: any) => ({
          _id: q._id,
          subject: q.subject,
          text: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty,
        }));
        setQuestions(transformedQuestions);
        console.log('Transformed Questions:', transformedQuestions);
      } catch (error) {
        console.error('Error fetching assessment questions:', error);
        toast.error('Failed to load assessment questions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessmentQuestions();
  }, []);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionSelect = (questionId: string, selectedOption: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));

    console.log('Selected Answers:', {
      ...selectedAnswers,
      [questionId]: selectedOption
    });
  };

  const handleSubmitAssessment = async () => {
    try {
      // Ensure all questions are answered
      if (Object.keys(selectedAnswers).length !== questions.length) {
        toast.error('Please answer all questions before submitting');
        return;
      }
      setIsSubmitting(true);

      const submissionData = {
        answers: questions.map(question => ({
          _id: question._id,
          selectedOption: selectedAnswers[question._id]
        }))
      };

      const response = await axios.post("http://localhost:5001/api/ai-tutor/evaluate",submissionData,{withCredentials: true});
      setIsSubmitting(false);
      console.log('Assessment Evaluation Response:', response.data);
      toast.success('Assessment submitted successfully!');
      navigate("/assessment-results", { state: { resultData: response.data } });
      
    } catch (error) {
      console.error('Assessment submission error:', error);
      setIsSubmitting(false);
      toast.error('Failed to submit assessment');
    }
  };

  const isNextDisabled = !selectedAnswers[questions[currentStep]?._id];

  if (isLoading) {
    return (
      <>
        <WcNavbar />
        <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
          <SpinningLoader />
        </div> 
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <WcNavbar />
        <div className="flex justify-center items-center h-screen">
          No assessment questions available.
        </div>
      </>
    );
  }

  return (
    <>
      <WcNavbar />
      {isSubmitting && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-50">
          <SpinningLoader />
          <p className="mt-14 text-xl font-semibold text-gray-800">
            Evaluating your results. Please wait...!
          </p>
        </div>
      )}
      
      <div className="max-w-full px-4 pb-4 md:mx-20 lg:mx-36 mt-16">
        <h2 className="text-xl md:text-2xl font-bold mt-8 text-center">Your Initial Assessment</h2>
        <div className="flex flex-col sm:flex-row items-center mt-4 md:mt-8 gap-4 md:gap-16">
          <div className="bg-[#349EFF] text-white rounded-md px-2 py-1 md:px-3 md:py-2 font-semibold">
            {questions[currentStep].subject.charAt(0).toUpperCase() + questions[currentStep].subject.slice(1).toLowerCase() || 'Maths & Logic'}
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 relative">
            <div className="w-full absolute h-1 bg-gray-300 -z-10"></div>
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center ${
                  index <= currentStep ? "bg-green-500 border-green-500" : "border-gray-400 bg-white"
                }`}
              >
                {index <= currentStep ? <IoCheckmarkOutline className="text-white text-lg sm:text-2xl" /> : <RxCross1 className="text-white text-lg sm:text-2xl"/>}
              </div>
            ))}
          </div>
          <h3 className="text-sm sm:text-base">Question {currentStep + 1}/{questions.length}</h3>
        </div>
        <div className="shadow-lg border px-5 pb-5 rounded-xl mt-4 md:mt-10">
          <h2 className="font-bold text-lg sm:text-2xl md:p-2">Q.{currentStep + 1}</h2>
          <div className="flex justify-center flex-col items-center">
            <h3 className="font-semibold text-base sm:text-xl mt-3 md:mt-0">
              {questions[currentStep].text}
            </h3>
          </div>
          <div className="flex flex-wrap max-w-full md:max-w-4xl justify-center mx-auto items-center gap-4 md:gap-5 mt-5">
            {questions[currentStep].options.map((option, index) => (
              <div
                key={index}
                className={`w-full sm:w-[400px] flex justify-between items-center border px-2 py-3 rounded-md shadow-md cursor-pointer ${
                  selectedAnswers[questions[currentStep]._id] === option 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-400'
                }`}
                onClick={() => handleOptionSelect(questions[currentStep]._id, option)}
              >
                <h4>{String.fromCharCode(65 + index)}. {option}</h4>
                <div className="flex items-center justify-center bg-gray-800 border border-gray-600 w-8 h-8 sm:w-10 sm:h-10 rounded-full">
                  <button 
                    className={`absolute bg-gray-50 w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-600 ${
                      selectedAnswers[questions[currentStep]._id] === option 
                        ? 'bg-green-500' 
                        : ''
                    }`}
                  ></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between gap-2 sm:gap-5 mt-4 md:mt-8">
        <button
            className="bg-red-500 p-2 rounded-md cursor-pointer text-base sm:text-lg font-semibold w-[120px] sm:w-[150px] shadow-md mb-2 text-black"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            BACK
          </button>
          {currentStep === questions.length - 1 ? (
            <button
            className={`p-2 rounded-md cursor-pointer text-base sm:text-lg font-semibold w-[120px] sm:w-[150px] shadow-md mb-2 ${
              isNextDisabled ? 'bg-gray-400 text-white hover:cursor-not-allowed' : 'bg-green-500'
            }`}
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
            >
              {isSubmitting ? <SpinningLoader /> : " SUBMIT" }
            </button>
          ) : (
            <button
            className={`p-2 rounded-md cursor-pointer text-base sm:text-lg font-semibold w-[120px] sm:w-[150px] shadow-md mb-2 ${
              isNextDisabled ? 'bg-gray-400 text-white hover:cursor-not-allowed' : 'bg-[#F7D232]'
            }`}
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            NEXT
          </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Assessment;