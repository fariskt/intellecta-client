import { useQuery } from "@tanstack/react-query";
// import LearningCards from "../../../components/cards/learingCards/LearningCards";
import Card from "../../../components/cards/uiCard/Card";
import BarChart from "../../../components/graph/BarChart";
// import DonutChart from "../../../components/graph/DonutChart";
import LineChart from "../../../components/graph/LineChart";
import axios from "axios";
// import { useState } from "react";



const DashboardComp = () => {
  // const [progress , setProgress] = useState(0)
  const { data, isLoading, error } = useQuery({
    queryKey: [""],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5005/api/progress/allusercourse/aa",
        {
          withCredentials: true, // Include cookies
        }
      );
      return response.data.data;
    },
  });
  console.log("respponse data", data);
  if (isLoading) {
    return (
      <div className="h-[500px] flex justify-center items-center">
        <h1>Loading..</h1>
      </div>
    );
  }
  if (error) {
    console.log("error", error);
    return (
      <div className="h-[500px] flex justify-center items-center">
        {error.message + "hello"} 
      </div>
    );
  }
  return (
    <div className="w-full h-full mt-5">
      {/* ===================================== */}
      <div className=" md:p-5 rounded-xl bg-white shadow-xl">
        <div className="text-lg font-semibold">
          <h1>Overview</h1>
        </div>
        <div className="flex justify-evenly  items-center text-white font-bold flex-wrap w-full">
          <Card mainHead={"Course Attempted"} value={data.length} />
          <Card mainHead={"Course Pending"} value={data.length} />
          <Card mainHead={"Course Completed"} value={0} />
          <Card mainHead={"Course Badge"} value={0} />
          <Card mainHead={"Quize Attempted"} value={0} />
        </div>
        <div>{/* empty now */}</div>
      </div>
      {/* ========================================== */}

      <div className="w-full  h-full flex  gap-5 mt-10 md:flex-nowrap flex-wrap">
        {/* <div className=" md:p-5  rounded-xl "> */}
          {/* <div>
            <h1 className="text-lg font-semibold ">Continue Learning</h1>
          </div> */}
          {/* <div className="flex flex-col gap-2 mt-3 "> */}
            {/* card course */}
            {/* {
              data?.map((item:any,index:number)=>(
                <LearningCards key={index+1} progress={item.progressPercent} title={item.courseId.title} />
              ))
            } */}
          {/* </div> */}
          {/* <div className="w-full h-96 bg-white rounded-xl mt-5 shadow-2xl"> */}
            {/* donut graph */}
            {/* <DonutChart /> */}
          {/* </div> */}
        {/* </div> */}
        <div className="bg-transparent md:p-4 rounded-xl w-full ">
          <div>
            <h1 className="text-lg font-semibold">Learning Statistics</h1>
          </div>
          <div className="w-full h-full  flex flex-col justify-start  items-start  gap-3 ">
            {/* bar graph */}
            <div className="  md:w-[43rem]      bg-white px-10 py-4 rounded-xl shadow-2xl">
              <BarChart />
            </div>
            {/* line graph */}
            {/* <div className="  md:w-[40rem] ">
              <LineChart  />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
