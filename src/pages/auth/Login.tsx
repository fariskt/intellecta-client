import { Link } from "react-router-dom";
import IntellectaLogo from "../../assets/Intellecta-logo.svg";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { userEndPoints } from "../../api/endPoints/userEndPoints";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

// Updated type definition
type LoginFormData = {
  email?: string;
  password?: string;
};

// Updated validation schema
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("This is not a valid email format!")
    .required("Email is required!"),
  password: yup
    .string()
    .min(4, "Password should contain at least 4 characters.")
    .max(10, "Password cannot exceed more than 10 characters")
    .required("Password required"),
});

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: LoginFormData) => {
    try {
      await axiosInstance.post(userEndPoints.USER.LOGIN, values);
      toast.success("Login Successfull 🎉");
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during registration:", error);
      const errorMessage =
        error.response?.data?.message || "Error logging user";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-[#FFEDAC] w-full min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col md:flex-row max-w-7xl w-full rounded-xl overflow-hidden">
        {/* Left Section (Image - Hidden on Mobile) */}
        <motion.div
          initial={{ x: 450, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:block w-1/2 h-full"
        >
          <img
            src="/login-bg.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </motion.div>

        {/* Right Section (Login Form) */}
        <motion.div
          initial={{ x: -400, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-[#FFCB3D] w-full md:w-1/2 p-6 md:p-8"
        >
          {/* Logo */}
          <div className="flex justify-end gap-2 items-center">
            <img src={IntellectaLogo} alt="Logo" className="h-[35px]" />
            <div>
              <h1 className="text-xl font-semibold">iNTELLECTA</h1>
              <h5 className="text-black/50 text-sm">Learn, Grow, Success</h5>
            </div>
          </div>

          <div className="mt-8 md:mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center">
              Your AI Tutor is Ready – Are You?
            </h2>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center w-full mt-4"
          >
            <div className="flex flex-col items-center w-full">
              {/* Email & Password Fields */}
              <div className="flex flex-col gap-5 items-center w-full md:mt-8">
                <input
                  type="text"
                  className="border-b w-full md:w-[400px] border-b-black/50 pl-2 pb-2 outline-none"
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="border-b w-full md:w-[400px] border-b-black/50 pl-2 pb-2 outline-none"
                    placeholder="Enter Password"
                    {...register("password")}
                  />
                  {showPassword ? (
                    <button
                      type="button"
                      className="absolute -ml-5 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    >
                      <FaEye />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="absolute -ml-5 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    >
                      <FaEyeSlash />
                    </button>
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="cursor-pointer mt-8 md:mt-12 p-2 shadow-[2px_3px_8px_rgba(0,0,0,0.38)] text-center bg-white rounded-4xl font-semibold w-full md:w-[300px]">
              <button className="text-base cursor-pointer">Let's Go</button>
            </div>

            <div className="flex gap-2 mt-2">
              <h4 className="font-medium">New here? Join us today by</h4>
              <Link to="/register">
                <span className="font-medium text-blue-700">Sign up</span>
              </Link>
            </div>

            <h3 className="font-semibold mt-2">- OR -</h3>

            {/* Google Login Button */}
            <div className="mt-2">
              <GoogleLogin
                onSuccess={async () => {
                  localStorage.setItem("isAuthenticated", "true");
                  navigate("/home");
                }}
                onError={() => console.log("Login Failed")}
                theme="outline"
                text="continue_with"
                shape="pill"
                width="300px"
              />
            </div>

            <h4 className="font-medium pt-2 text-center">
              Your Smart Learning Journey Starts Here!
            </h4>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
