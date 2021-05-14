import { produce } from "immer"
import { winCheck } from "./victory"
import {
  BoardSide,
  CellState,
  RootState,
  Token,
  GameAction,
  playMovePayload,
} from "./types"

export const playMove = (
  state: RootState,
  { side, row, token }: playMovePayload
): RootState => {
  return produce((draftState: RootState): void => {
    if (draftState.game.status === "PLAYING") {
      pushToRow(draftState.board[row], side, token)
      draftState.game.myTurn = !draftState.game.myTurn
      // if (winCheck(draftState.board, myToken)) {
      //   draftState.game = { status: "GAME_OVER", won: true }
      // }
    }
    // should be impossible
    else {
      console.error("Tried to play move out of valid turn")
    }
  })(state)
}

// mutates row in place
// assume:
// - all blanks are in the middle
export const pushToRow = (
  row: CellState[],
  side: BoardSide,
  token: Token
): void => {
  for (let i = 0; i < row.length; i++) {
    const col = side === "R" ? row.length - 1 - i : i
    if (row[col] === "_") {
      row[col] = token
      return
    }
  }
  // if we reach the end of the row,
  throw new Error("Row is full.")
}
