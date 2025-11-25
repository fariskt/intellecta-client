import { useQuery } from "@tanstack/react-query";
import gamebg4 from "/game/test4.png";
import { useGameStore } from "../../../store/useGameStore";
import GameFooter from "./GameFooter";
import LeaderboardPreview from "./LeaderboardPreview";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import PlayNow from "../Games/PlayNow";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { gamesLocal } from "../../../utils/games";

export const showToast = () => {
  toast.warn(
    <div>
      Please login to continue{" "}
      <Link className="underline text-blue-500" to="/login">
        Login
      </Link>
    </div>,
    { position: "top-right" }
  );
};

const GameHome = () => {
  const {
    leaderboard,
    showPlayNow,
    setShowPlayNow,
    leaderboardLoading,
  } = useGameStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: recentgame } = useQuery({
    queryKey: ["recentgame"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:5002/api/games/latest/recent-game",
        { withCredentials: true }
      );
      const games = res.data.games;
      return res.data.games[games.length - 1];
    },
    enabled: !!user,
  });

  const startGame = (slug: string) => {
    setShowPlayNow(true);
    setShowPlayNow(false);
    navigate(`/games/${slug}/`);
    setTimeout(() => {}, 2000);
  };

  return (
    <>
      <div className="p-5 md:mx-36">
        <div className="flex flex-col md:flex-row md:justify-between  mt-10">
          <div className="max-w-md space-y-3">
            <h3 className="text-violet-800 text-lg md:text-4xl font-bold">
              EXPLORE OUR GAMES
            </h3>
            <h1 className="md:text-6xl text-4xl  text-white font-semibold">
              Play. Compete. Conquer.
            </h1>
            <p className="text-gray-200">
              Jump into a world of exciting games, daily challenges, and
              real-time leaderboards. Whether you're here to have fun or climb
              the ranks, the adventure starts now.
            </p>
            <Link to="/games/allgames">
              <button
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-xl cursor-pointer
              shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
              transform hover:scale-105"
              >
                Explore Games
              </button>
            </Link>
          </div>
          <motion.div
            initial={{ x: "2%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "20%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <img
              src={gamebg4}
              alt="Game Controller"
              className="hidden mt-7 md:block max-w-xl h-[450px] relative bottom-16 transition-all  duration-700 ease-in-out hover:scale-105"
            />
          </motion.div>
        </div>
        {recentgame && (
          <div>
            <h2 className="md:mt-0 mt-8 text-white text-lg font-medium mb-4">
              Recently Played
            </h2>
            <div>
              <div className="absolute mt-10 md:ml-10 ml-3 z-10 space-y-2">
                <h1 className="text-3xl text-white font-semibold">Let's Go</h1>
                <p className="text-white">
                  Hope you had fun! Ready for another round?
                </p>
                <Link to={`/games/${recentgame?.slug}`}>
                  <button className="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95">
                    <span className="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      >
                        <path d="M8 13V9m-2 2h4m5-2v.001M18 12v.001m4-.334v5.243a3.09 3.09 0 0 1-5.854 1.382L16 18a3.618 3.618 0 0 0-3.236-2h-1.528c-1.37 0-2.623.774-3.236 2l-.146.292A3.09 3.09 0 0 1 2 16.91v-5.243A6.667 6.667 0 0 1 8.667 5h6.666A6.667 6.667 0 0 1 22 11.667Z"></path>
                      </svg>
                      Play Game
                    </span>
                  </button>
                </Link>
              </div>
              <img
                src={recentgame?.thumbnailImg}
                alt="recent-game"
                className="h-72 w-full object-cover opacity-70 z-0 rounded-2xl shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
              />
            </div>
          </div>
        )}
        <div className="mt-10">
          <div className="flex justify-between">
            <h2 className="text-white text-lg font-medium mb-4">
              Featured Games
            </h2>
            <p className="text-white mr-2 cursor-pointer">view all</p>
          </div>
          <div className="">
            <div className="grid grid-cols-2 md:grid-cols-3 md:gap-8 gap-5">
              {gamesLocal?.map((item) => (
                <div onClick={() => startGame(item.slug)}>
                  <img
                    src={item.thumbnailImg}
                    alt=""
                    className="h-60 w-[380px] object-cover rounded-2xl hover:scale-105 transition duration-200 cursor-pointer shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
                  />
                  <h1 className="text-white text-lg m-1">{item.name}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
        {showPlayNow && <PlayNow isVisible={showPlayNow} />}
        <LeaderboardPreview
          leaderboard={leaderboard}
          leaderboardLoading={leaderboardLoading}
        />
      </div>
      <GameFooter />
    </>
  );
};

export default GameHome;
