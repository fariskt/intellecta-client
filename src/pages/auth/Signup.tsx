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


// Updated type definition
type RegisterFormData = {
  firstname?: string;
  lastname?: string;
  email?: string;
  age?: string;
  phone?: string;
  password?: string;
};


// Updated validation schema
const validationSchema = yup.object().shape({
  firstname: yup.string().required("First name is required!"),
  lastname: yup.string().optional(),
  email: yup
    .string()
    .email("This is not a valid email format!")
    .required("Email is required!"),
  age: yup
    .string()
    .matches(/^\d+$/, "Age must be a number")
    .required("Age is required!"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits!")
    .required("Phone is required!"),
  password: yup
    .string()
    .min(6, "Password should contain at least 6 characters.")
    .max(10, "Password cannot exceed more than 10 characters")
    .required("Password required"),
});

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      console.log("submitting", values);
      const response = await axiosInstance.post(
        userEndPoints.USER.REGISTER,
        values,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Registration success:", response);
      localStorage.setItem("isAuthenticated", "true");
      toast.success("You're officially registered 🎉");
      navigate("/welcome");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during registration:", error);
      const errorMessage =
        error.response?.data?.message || "Error registering user";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-[#FFEDAC] w-full min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col md:flex-row max-w-7xl w-full rounded-xl overflow-hidden">
        <motion.div
          initial={{ x: 350, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-[#FFCB3D] w-full md:w-1/2 p-6 md:p-8"
        >
          <div className="flex gap-2 items-center">
            <img src={IntellectaLogo} alt="" className="h-[35px]" />
            <div>
              <h1 className="text-xl font-semibold">iNTELLECTA</h1>
              <h5 className="text-black/50 text-sm">Learn, Grow, Success</h5>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-center mt-6">
              Transform the Way You Learn!
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center w-full"
          >
            <div className="flex flex-col gap-6 md:gap-10 w-full mt-8">
              {/* First & Last Name */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-16 w-full">
                <div className="w-full md:w-[250px]">
                  <input
                    type="text"
                    className="border-b w-full border-b-black/50 pb-2 outline-none"
                    placeholder="First Name"
                    {...register("firstname")}
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-xs">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-[250px]">
                  <input
                    type="text"
                    className="border-b w-full border-b-black/50 pb-2 outline-none"
                    placeholder="Last Name"
                    {...register("lastname")}
                  />
                </div>
              </div>

              {/* Email & Age */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-16 w-full">
                <div className="w-full md:w-[250px]">
                  <input
                    type="text"
                    className="border-b w-full border-b-black/50 pb-2 outline-none"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-[250px]">
                  <input
                    type="string"
                    className="border-b w-full border-b-black/50 pb-2 outline-none"
                    placeholder="Age"
                    {...register("age")}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs">{errors.age.message}</p>
                  )}
                </div>
              </div>

              {/* Phone Number & Password */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-16 w-full">
                <div className="w-full md:w-[250px]">
                  <input
                    type="text"
                    className="border-b w-full border-b-black/50 pb-2 outline-none"
                    placeholder="Phone Number"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-[250px]">
                  <input
                    type="password"
                    className="border-b w-full border-b-black/50 pb-2 outline-none"
                    placeholder="Create Password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 w-full p-2 shadow-[4px_4px_10px_rgba(0,0,0,0.4)] text-center bg-white rounded-4xl font-semibold md:w-[300px]">
              <button type="submit" className="text-base cursor-pointer">
                Join Now
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <h4 className="font-medium">Already have an account ?</h4>
              <Link to="/login">
                <span className="font-medium text-blue-700">Sign In</span>
              </Link>
            </div>
            <h3 className="font-semibold">-OR-</h3>
            <div className="mt-2">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const post = await axiosInstance.post(
                    "/user/google-login",
                    credentialResponse
                  );
                  const user = post.data.data;
                  console.log("post user", user);
                  localStorage.setItem("isAuthenticated", "true");
                  navigate("/welcome");
                }}
                onError={() => console.log("Login Failed")}
                theme="outline"
                text="continue_with"
                shape="pill"
                width="300px"
              />
            </div>
            <h4 className="font-medium mt-2 text-center">
              Join Intellecta & Unlock Your Potential!
            </h4>
          </form>
        </motion.div>
        <motion.div
          initial={{ x: -350, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:block w-1/2 h-full z-10"
        >
          <img src="/signup-bg.png" className=" w-full h-full" alt="" />
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
