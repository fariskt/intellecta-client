/* eslint-disable @typescript-eslint/no-explicit-any */
// BarChart.tsx
import { Bar } from "react-chartjs-2";
import { ChartOptions, FontSpec } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import { color } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC = () => {
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

  const labelsText = data.map((item: any) => item.courseId.title);
  const values = data.map((item: any) => item.progressPercent);

  const barData = {
    labels: labelsText,
    datasets: [
      {
        label: "Lessons",
        data: values,
        backgroundColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)", // Red
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(255, 206, 86, 1)", // Yellow
          "rgba(75, 192, 192, 1)",
        ],
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          color: "#1f2937",
          font: {
            size: 13,
            weight: 500, // FIXED
            family: "Inter",
          } as Partial<FontSpec>, // FIXED
          padding: 8,
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        type: "linear",
        ticks: {
          color: "#1f2937",
          font: {
            size: 13,
            weight: 500, // FIXED
            family: "Inter",
          } as Partial<FontSpec>, // FIXED
          padding: 8,
          callback: (value) => `${value}%`, // FIXED
        },
        title: {
          display: true,
          text: "Progress (%)",
          color: "#1f2937",
          font: {
            size: 14,
            weight: "bold",
          } as Partial<FontSpec>,
        },
      },
    },
  };

  return <Bar className="w-full" data={barData} options={options} />;
};

export default BarChart;
