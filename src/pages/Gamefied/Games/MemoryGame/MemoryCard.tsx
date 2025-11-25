import QuestionImage from "/game/question-mark.png";

interface CardType {
  src: string;
  matched: boolean;
}

interface MemoryCardProps {
  card: CardType;
  handleChoice: (card: CardType) => void;
  flipped: boolean;
  disabled: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if (!disabled && !flipped) {
      handleChoice(card);
    }
  };

  return (
    <div
      className="bg-gray-700 relative p-2 cursor-pointer rounded-lg shadow"
      onClick={handleClick}
    >
      <div className={`transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}>
        <img
          src={flipped ? card.src : QuestionImage}
          alt="card"
          className="w-24 h-20 object-contain"
        />
      </div>
    </div>
  );
};

export default MemoryCard;
