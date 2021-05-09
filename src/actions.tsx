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
    pushToRow(draftState.board[row], side, token)
    draftState.p1Turn = !draftState.p1Turn
  })(state)
}

// mutates row in place
// assume:
// - all blanks are in the middle
const pushToRow = (
  row: CellState[],
  side: BoardSide,
  token: CellState
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
