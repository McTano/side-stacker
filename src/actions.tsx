import { produce } from "immer"
import { BoardSide, CellState, GameState } from "./types"

export type GameAction = {
  type: "playMove"
  payload: playMovePayload
}

type playMovePayload = { side: BoardSide; token: "X" | "O"; row: number }

export const playMove = (
  state: GameState,
  { side, token, row }: playMovePayload
): GameState => {
  return produce((draftState: GameState) => {
    console.log(state)
    pushToRow(draftState.board[row], side, token)
  })(state)
  //   if (side === "R") {
  //     targetRow = [...targetRow].reverse()
  //   }
}

// mutates row in place
// assume:
// - all blanks are in the middle
const pushToRow = (
  row: CellState[],
  side: BoardSide,
  token: CellState
): void => {
  //   if (side === "R") {
  //     targetRow = [...targetRow].reverse()
  //   }
  for (let i = 0; i < row.length; i++) {
    if (row[i] === "_") {
      row[i] = token
      return
    }
  }
  // if we reach the end of the row,
  console.error("Row is full.", row, side, token)
}
