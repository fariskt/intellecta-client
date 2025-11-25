import React, { useRef, useState } from "react";
import { FaEdit, FaCamera } from "react-icons/fa";
import student from "../assets/Profile.jpg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { userEndPoints } from "../api/endPoints/userEndPoints";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SpinningLoader from "../components/Loaders/SpinningLoader";
import NavbarWelcome from "../components/Navbar/NavbarWelcome";

const fetchUser = async () => {
  const { data } = await axiosInstance.get(userEndPoints.USER.GET_PROFILE);
  return data.data.user;
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    profilePic: student, // Default image
  });

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  // Update profile state when user data is fetched
  React.useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        phone: user.phone || "",
        profilePic: user.profilePic || student, // Adjust base URL as needed
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#081a37]">
        <SpinningLoader />
      </div>
    );
  }
  if (isError) return <p>Error loading profile</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: name === "age" ? Number(value) || "" : value,
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosInstance.post(
        userEndPoints.USER.UPLOAD_PROFILE, // Assuming this endpoint handles image upload; adjust if separate
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        profilePic: response.data.data || student,
      }));
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Update the user data in the cache
      console.log("img response", response.data.data);
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(
        userEndPoints.USER.EDIT_PROFILE,
        {
          name: profile.name,
          email: profile.email,
          phone: profile.phone, // API expects 'phone' based on response
          age: profile.age,
          profilePic: profile.profilePic,
        }
      );
      console.log("Updated Profile:", response.data);
      toast.success("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleFocus = (index:number)=> {
    inputRefs.current[index]?.focus()
  }

  return (
    <>
      <NavbarWelcome />
      <div className="flex justify-center min-h-screen pt-16 bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-xl h-fit bg-[#0f172a] border border-slate-600 shadow-2xl rounded-3xl p-8 space-y-6 transition-all duration-300"
        >
          {/* Profile Image Upload */}
          <div className="flex justify-center w-full relative">
            <label className="absolute -bottom-1 ml-16 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-300 transition">
              <FaCamera className="text-gray-700 text-md" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <img
              src={profile.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg "
            />
          </div>

          {/* User Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-slate-300">{profile.email}</p>
          </div>

          {/* Editable Fields */}
          <div className="space-y-5">
            {[
              { label: "Name", name: "name", value: profile.name },
              { label: "Email", name: "email", value: profile.email },
              { label: "Phone", name: "phone", value: profile.phone },
              { label: "Age", name: "age", value: profile.age || 0 },
            ].map((field, index) => (
              <div
                key={field.name}
                className="flex items-center justify-between gap-4"
              >
                <span className="font-medium text-slate-200 w-1/3">
                  {field.label}:
                </span>
                <div className="flex items-center space-x-2 w-2/3">
                  <input
                    type="text"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ref={(el: any) => (inputRefs.current[index] = el)}
                    name={field.name}
                    value={field.value}
                    onChange={handleChange}
                    className="w-full py-2 px-3 bg-transparent border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  
                    <FaEdit onClick={()=> handleFocus(index)} className="text-slate-300 cursor-pointer hover:text-blue-400 transition" />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-slate-700 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
