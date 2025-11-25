import { useState, useEffect } from "react";
import Card from "./MemoryCard";
import apple from "/game/apple.png";
import cherry from "/game/cherry.png";
import mangosteen from "/game/mangosteen.png";
import orange from "/game/orange.png";
import strawberry from "/game/strawberry.png";
import grape from "/game/grape.png";
import { RiResetRightFill } from "react-icons/ri";
import WinScreen from "./WinScreen";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGameStore } from "../../../../store/useGameStore";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../../store/useAuthStore";

const cardImages = [
  { src: apple, matched: false },
  { src: cherry, matched: false },
  { src: mangosteen, matched: false },
  { src: orange, matched: false },
  { src: strawberry, matched: false },
  { src: grape, matched: false },
];

type CardType = {
  src: string;
  matched: boolean;
};

const MemoryGame = () => {
  const { submitGameSession } = useGameStore();
  const { user } = useAuthStore();
  const [cards, setCards] = useState<CardType[]>([]);
  const [choiceOne, setChoiceOne] = useState<CardType | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameStarted && !isGameWon) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, isGameWon]);

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    setCards(shuffled);
    setMoves(0);
    setTime(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setGameStarted(false);
  };

  const handleChoice = (card: CardType) => {
    if (!gameStarted) setGameStarted(true);
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setMoves((prev) => prev + 1);
    setDisabled(false);
  };

  useEffect(() => {
    shuffleCards();
    setIsGameWon(false);
  }, []);

  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) {
      setIsGameWon(true);
      handleGameCompletion();
    }
  }, [cards]);

  const handleGameCompletion = async () => {
    const calculatedScore = Math.max(100 - (moves * 3) / 2 - time / 5, 0);
    await submitGameSession({
      userId: user?._id||"",
      gameSlug: "memory_game",
      score: calculatedScore,
      timeTaken: time,
    });

    toast.success("Score updated successfully");
  };

  return (
    <div className="absolute left-0 top-0 w-screen min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex text-white justify-center items-center p-4">
      <Link to="/games/allgames">
        <button className="cursor-pointer absolute top-5 left-5 text-2xl font-semibold">
          <IoMdClose />
        </button>
      </Link>
      <div className="bg-gray-900/80 h-fit mt-5 backdrop-blur-md rounded-3xl border-2 border-gray-400 shadow-md p-6 max-w-3xl w-full">
        <p className="absolute right-10 mt-2 text-lg text-blue-600">
          ⏱️ Time: {time}s
        </p>
        <h1 className="text-2xl font-bold mb-10 drop-shadow-sm">Memory Match Game</h1>

        <div className="grid grid-cols-4 gap-8 justify-items-center">
          {cards.map((card, index) => (
            <Card
              key={index}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="mt-6 text-right text-lg font-medium text-purple-600">
            🧮 Moves: <span className="font-bold">{moves}</span>
          </p>
          <button
            onClick={shuffleCards}
            className="cursor-pointer bg-blue-800 p-2 mt-5 rounded-full text-white text-xl"
          >
            <RiResetRightFill />
          </button>
        </div>
      </div>
      {isGameWon && (
        <WinScreen
          moves={moves}
          onRestart={() => {
            shuffleCards();
            setIsGameWon(false);
          }}
        />
      )}
    </div>
  );
};

export default MemoryGame;
