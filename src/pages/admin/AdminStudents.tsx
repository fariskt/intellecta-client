import React, { useState } from "react";
import DeleteButton from "../../utils/ui/deleteButton";
import { deleteuser, fetchStudents } from "./services/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AllStudentsLoader from "../../utils/ui/allStudentsLoader";

export interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  profilePic?: string;
  role: "student";
  createdAt: string;
  updatedAt: string;
}

const AdminStudents = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [catagory, setCatagory] = useState("");
  const [page, setPage] = useState(1);
  const isBlock = undefined;

  const queryClient = useQueryClient();
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["students", { page, search, catagory, isBlock }],
    queryFn: () => fetchStudents({ page, search, catagory, isBlock }),
    placeholderData: [],
  });

  const handleDelete = (userId: string) => {
    mutation.mutate(userId);
  };

  const mutation = useMutation({
    mutationFn: deleteuser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: any) => {
      console.error("Failed to delete user", error);
      alert("Failed to delete user.");
    },
  });

  const handleSearchClick = () => {
    setSearch(searchInput);
  };

  const handleAgeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCatagory(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[75vh]">
        <AllStudentsLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load students. {String(error)}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex w-full md:w-1/2 gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <button
            onClick={handleSearchClick}
            className="bg-[#789A94] text-white px-4 rounded-md hover:bg-[#5d817a] transition"
          >
            Search
          </button>
        </div>

        <select
          value={catagory}
          onChange={handleAgeFilterChange}
          className="border border-gray-300 p-2 rounded-md w-full md:w-[200px]"
        >
          <option value="">All Age Groups</option>
          <option value="5-8">Age 5-8</option>
          <option value="9-12">Age 9-12</option>
          <option value="13-18">Age 13-18</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-4xl shadow overflow-hidden">
        <div className="max-h-[65vh] overflow-y-auto relative scrollbar-hide">
          <table className="w-full table-fixed">
            <thead className="bg-[#789A94] sticky top-0 z-10 text-sm text-white">
              <tr>
                <th className="p-4 w-[100px]">Image</th>
                <th className="p-4 w-[150px]">Name</th>
                <th className="p-4 w-[200px]">Email</th>
                <th className="p-4 w-[120px]">Age</th>
                <th className="p-4 w-[140px]">Mobile</th>
                <th className="p-4 w-[100px]">Status</th>
                <th className="p-4 w-[100px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students && students.map((student: Student, index: number) => (
                <tr
                  key={student._id}
                  className={`transition-colors duration-200 ${
                    index % 2 === 0
                      ? "bg-[#BBD2CB] text-[#4F4F4F]"
                      : "bg-white text-[#4F4F4F]"
                  }`}
                >
                  <td className="p-4">
                    <img
                      src={student.profilePic}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4">{student.age}</td>
                  <td className="p-4">{student.phone}</td>
                  <td className="p-4">active</td>
                  <td className="p-4 text-center">
                    <div
                      className="text-red-500 hover:text-red-700 transition font-medium"
                      onClick={() => handleDelete(student._id)}
                    >
                      <DeleteButton />
                    </div>
                  </td>
                </tr>
              ))}
              {students?.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
