import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface GameWinnerProps {
  gameName: string;
  gameScore:number
}

const GameWinner : React.FC<GameWinnerProps> = ({ gameScore =0 }) => {
  return (
    <div className="absolute z-50 left-0 top-0 w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a40] via-[#301934] to-[#0f0c29] text-white p-6 overflow-hidden">
         <Link to="/games/allgames">
        <button className="cursor-pointer absolute top-5 left-5 text-2xl font-semibold">
          <IoMdClose />
        </button>
      </Link>
      <h1 className="text-3xl mb-10">Congratulations, you did it! 🎉</h1>
      <StyledWrapper>
        <div className="container">
          <svg
            className="svg-icon"
            height={100}
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 100 100"
            width={100}
            x={0}
            xmlns="http://www.w3.org/2000/svg"
            y={0}
          >
            <path d="M62.11,53.93c22.582-3.125,22.304-23.471,18.152-29.929-4.166-6.444-10.36-2.153-10.36-2.153v-4.166H30.099v4.166s-6.194-4.291-10.36,2.153c-4.152,6.458-4.43,26.804,18.152,29.929l5.236,7.777v8.249s-.944,4.597-4.833,4.986c-3.903,.389-7.791,4.028-7.791,7.374h38.997c0-3.347-3.889-6.986-7.791-7.374-3.889-.389-4.833-4.986-4.833-4.986v-8.249l5.236-7.777Zm7.388-24.818s2.833-3.097,5.111-1.347c2.292,1.75,2.292,15.86-8.999,18.138l3.889-16.791Zm-44.108-1.347c2.278-1.75,5.111,1.347,5.111,1.347l3.889,16.791c-11.291-2.278-11.291-16.388-8.999-18.138Z"></path>
          </svg>
          <div className="container__star">
            <div className="star-eight" />
          </div>
            <h3 className="score-show">{gameScore}</h3>
          <div />
        </div>
      </StyledWrapper>
      <h1 className="text-3xl mt-10">
        You've completed the challenge with a score of{" "}
        <span className="font-semibold text-blue-600">{gameScore || 0}</span>!
      </h1>
    </div>
  );
};

const StyledWrapper = styled.div`
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 5em;
    font-weight: 900;
    color: #e10600;
    position: relative;
    transition: all 1s ease;
    text-align: center;
  }

  .container__star {
    transition: all 0.7s ease-in-out;
  }



  .first {
    position: absolute;
    top: 20px;
    left: 50px;
    transition: all 0.7s ease-in-out;
  }

  .svg-icon {
    position: absolute;
    margin-bottom:100px;
    fill: #e94822;
    z-index: 1;
  }

  .star-eight {
    background: #efd510;
    width: 150px;
    height: 150px;
    position: relative;
    text-align: center;
    animation: rot 3s infinite;
  }

  .star-eight::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 150px;
    width: 150px;
    background: #efd510;
    transform: rotate(135deg);
  }

  .container:hover .container__star {
    transform: rotateX(70deg) translateY(250px);
    box-shadow: 0px 0px 120px -100px #e4e727;
  }

  .container:hover .svg-icon {
    animation: grow 1s linear infinite;
  }

  @keyframes rot {
    0% {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(340deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes grow {
    0% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(-5deg);
    }

    75% {
      transform: rotate(5deg);
    }

    100% {
      transform: scale(1) rotate(0deg);
    }
  }
`;

export default GameWinner;
