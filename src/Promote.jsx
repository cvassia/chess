import React from "react";
import { move } from "./Game";
const promotionPieces = ["r", "n", "b", "q"];
export default function Promote({ promotion: { from, to, color } }) {
  return (
    <div className="board">
      {promotionPieces.map((p, i) => (
        <div className="promote-square" key={i}>
          <div className="piece-container" onClick={() => move(from, to, p)}>
            <img
              className="piece toChoose"
              src={require(`./assets/${p}_${color}.png`)}
              alt="four pieces to choose"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
