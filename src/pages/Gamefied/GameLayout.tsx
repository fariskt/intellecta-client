import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
// import GameSidebar from "./GamePages/GameSidebar";
import { useEffect, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { userEndPoints } from "../../api/endPoints/userEndPoints";
import DockLid from "./gameNav/DockLid";
import violetemerald from "/game/violet-emerald.png";
import "./Games.css";
import axios from "axios";
import { gamesLocal } from "../../utils/games";

const GamesLayout = () => {
  const { fetchGames, fetchLeaderboard } = useGameStore();
  const { setUser, user } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pathsToHide = [
    "/games/memory_game",
    "/games/word_builder",
    "/games/tic_tac_toe",
    "/games/number_ninja",
  ];
  const shouldHideComponent = pathsToHide.some((path) =>
    pathname.includes(path)
  );

  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(userEndPoints.USER.GET_PROFILE);
      setUser(data.data.user);
      return data.data.user;
    },
  });

  const { data: userstats } = useQuery({
    queryKey: ["fetchUserleaderboard"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5002/api/games/userbyid/leaderboard",
        { withCredentials: true }
      );
      return res.data?.leaderboard || {};
    },
    enabled: !!user,
  });

  useEffect(() => {
    fetchGames();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const [searchVal, setSearchVal] = useState("");
  const searchedGames = gamesLocal.filter((game) =>
    game.name.toLowerCase().includes(searchVal.toLocaleLowerCase())
  );

  const handleGame = (slug: string) => {
    navigate(`/games/${slug}`);
    setSearchVal("");
  };


  return (
    <div className="min-h-screen bg-gradient-to-l from-[#0b2672] to-[#111827]">
      <nav className="flex justify-between md:mx-40 mx-4 py-4 text-white ">
        <div className="flex gap-10">
          <div className="flex items-center gap-2">
            <Link to="/games">
              <h1 className="font-semibold text-xl">Intellecta</h1>
            </Link>
          </div>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search games"
            className="hidden md:block rounded-3xl pl-4 outline-0 h-10 my-auto
            shadow-md
            placeholder-gray-400 text-white
            bg-white/10
            font-medium
            backdrop-blur-sm"
          />
        </div>
        {searchVal && (
          <div className="absolute z-50 top-16 left-72 bg-gray-600 bg-opacity-80 backdrop-blur-md text-white rounded-lg shadow-lg">
            {searchedGames.map((item) => (
              <div
                onClick={() => handleGame(item.slug)}
                key={item.name}
                className="py-2 px-3  hover:bg-gray-700 rounded-md transition"
              >
                {item.name}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-5">
          <Link to="/home">
            <span className="text-2xl">
              <IoMdHome />
            </span>
          </Link>
          <div className="flex items-center rounded-3xl space-x-2 px-3 py-1 bg-sky-800">
            <img src={violetemerald} alt="" className="md:h-8 h-5" />
            <span className="text-base font-semibold">
              {Math.floor(userstats?.totalScore) || 0}
            </span>
          </div>
          <Link to="/games/myprofile">
            <div>
              <img
                src={user?.profilePic || "/home-bg.png"}
                alt=""
                className="md:w-10 md:h-10 h-9 w-9 object-cover cursor-pointer rounded-full bg-white"
              />
            </div>
          </Link>
        </div>
      </nav>

      <div className="flex">
        {/* <GameSidebar /> */}
        <div className="w-full min-h-full">
          <Outlet />
        </div>
      </div>
      {!shouldHideComponent && (
        <div className="w-full  flex justify-center ">
          {/* <GameEyeLid /> */}
          <DockLid />
        </div>
      )}
    </div>
  );
};

export default GamesLayout;
