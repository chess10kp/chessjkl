import React from "react";
import { useState, useEffect  } from "react";
import "../container/Container.css"

const PlayerSideBar = (props) => {
  return(
  <div>
    {props.player}
    </div>
  )

};

  const BoardPlayer = (props) => {
    return (
      <div className="player-display">
        {/* <Timer initialMinute={4} initialSecond={0}></Timer> */}
        {props.player}
      </div>
    );
  };

  const Timer = (props) => {
    const { initialMinute = 0, initialSecond = 0 } = props;
    const [minutes, setMinutes] = useState(initialMinute);
    const [seconds, setSeconds] = useState(initialSecond);
    useEffect(() => {
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

export default PlayerSideBar;
