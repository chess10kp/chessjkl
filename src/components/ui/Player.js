import React from "react";
import { useState, useEffect  } from "react";
import "../container/Container.css"
import "./Player.css"

function BoardPlayer({player, turnToMove}) {
  const isTurnToMove = (player[0] == turnToMove.current.toLowerCase())
  return (
    <>
    <div id={player == "white" ? "player-info-white" : "player-info-black"} className={isTurnToMove ? "active-player" : "inactive-player"}>
        <Timer initialMinute={2} initialSecond={0} clockPlay={isTurnToMove}></Timer>
      </div>
    </>
  )
}

const Timer = (props) => {
    const { initialMinute = 0, initialSecond = 0, clockPlay = false } = props;
    const [minutes, setMinutes] = useState(initialMinute);
    const [seconds, setSeconds] = useState(initialSecond);
    useEffect(() => {
  if (!clockPlay) {
    return
  }
      let myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds == 0) {
          if (minutes == 0) {
            clearInterval(myInterval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    });
    return (
      <div>
        {minutes == 0 && seconds == 0 ? null : (
          <h1>
            {" "}
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
          </h1>
        )}
      </div>
    );
  };


export default BoardPlayer;
