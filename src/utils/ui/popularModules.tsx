import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from "recharts";
  
  import { useEffect, useState } from "react";
  import axios from "axios";
  
  export function PopularModulesCard() {
    const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopModules = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/progress/top");
        setData(response.data.data); 
      } catch (error) {
        console.error("Failed to fetch top modules:", error);
      }
    };

    fetchTopModules();
  }, []);

    return (
      <div className="bg-white rounded-2xl shadow-md p-6 w-full col-span-6">
        <h2 className="text-2xl font-semibold mb-4">Popular Modules</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="title" 
                interval={0}
                angle={-45} 
                textAnchor="end" 
                height={60}
                className="text-xs"
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="userCount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  