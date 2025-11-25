//getting all users 

import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";

export interface Lesson {
  _id?: string;
  title: string;
  url:string;
  content:string;
  type:string;
  resources:string[];
  order:number;
  notes:string;
  // Add other lesson properties if needed (e.g., duration, content)
}

export interface Course {
  _id: string;
  title: string;
  subject: string;
  description: string;
  gradeLevel: number;
  thumbnail?: string;
  difficultyLevel: string

}

interface CourseDetailsResponse {
  course: Course;
  lessons: Lesson[]|[];
}


type FetchStudentsParams = {

  page?: number;
  limit?: number;
  search?: string;
  catagory?: string;
  isBlock?: boolean;
};

export const fetchStudents = async (params: FetchStudentsParams = {}) => {
  const response = await axiosInstance.get("http://localhost:5000/api/user/allUsers", {
    params,
  });

  return response.data?.users || [];
};


export const fetchCourses = async () =>{
  const response = await axiosInstance.get("http://localhost:5005/api/courses")
  return response.data.data;
}

export const fetchAdminDashboard = async () => {
  const response = await axiosInstance.get("http://localhost:5006/api/admin/adminDashboard");
  console.log(response.data)
  return response.data
}


interface NotificationPayload {
  title: string;
  message: string;
  type: string;
  targetType: string;
  targetAgeGroup?: string;
  recipientId?: string;
}

export const sendNotification = async (notificationData: NotificationPayload) => {
  console.log("notificaiton data from service : ", notificationData)
  const response = await axiosInstance.post("http://localhost:5008/api/notification/send", notificationData);
  console.log(response.data)
  return response.data
}

export const getCurentAdmin = async () => {
  const response = await axiosInstance.get("http://localhost:5000/api/user/getuserbyid");
  console.log(response.data)
  return response.data
} 


export const fetchCourseDetails = async (courseId: string): Promise<CourseDetailsResponse> => {
  const response = await axios.get(`http://localhost:5005/api/courses/${courseId}`);
  console.log("details....", response.data.data);
  return response.data.data ||[];
};
export const deleteuser = async (userId: string) => {
  console.log("deleteuser:", userId)
  const response = await axiosInstance.post("http://localhost:5000/api/user/delete-user", userId)
  console.log(response.data)
  return response.data
}
