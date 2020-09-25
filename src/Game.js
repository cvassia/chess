import * as Chess from "chess.js";
import { BehaviorSubject } from "rxjs";

// let promotion = "rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5";
// let checkmate = "rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3";

const chess = new Chess();

export const gameSubject = new BehaviorSubject();

export function initGame() {
  const savedGame = localStorage.getItem("savedGame");
  if (savedGame) {
    chess.load(savedGame);
  }
  updateGame();
}

export function resetGame() {
  chess.reset();
  updateGame();
}

export function handleMove(from, to) {
  const promotions = chess.moves({ verbose: true }).filter((m) => m.promotion);
  if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
    const pendingPromotion = { from, to, color: promotions[0].color };
    updateGame(pendingPromotion);
  }
  const { pendingPromotion } = gameSubject.getValue();
  if (!pendingPromotion) {
    move(from, to);
  }
}

export function move(from, to, promotion) {
  let tempMove = { from, to };
  if (promotion) {
    tempMove.promotion = promotion;
  }

  const legalMove = chess.move(tempMove);
  if (legalMove) {
    updateGame();
  }
}

function updateGame(pendingPromotion) {
  const isGameOver = chess.game_over();
  const newGame = {
    board: chess.board(),
    pendingPromotion,
    isGameOver,
    result: isGameOver ? getGameResult() : null,
  };

  localStorage.setItem("savedGame", chess.fen());

  gameSubject.next(newGame);
}

function getGameResult() {
  if (chess.in_checkmate()) {
    const winner = chess.turn() === "w" ? "black" : "white";
    return `Checkmate - winner - ${winner}`;
  } else if (chess.in_draw()) {
    let reason = "50 - moves - rule";
    if (chess.in_stalemate()) {
      reason = "Stalemate";
    } else if (chess.in_threefold_repetition()) {
      reason = "Repetition";
    } else if (chess.insufficient_material()) {
      reason = "insufficient material";
    }
    return `Draw - ${reason}`;
  } else {
    return "unknown reason";
  }
}
