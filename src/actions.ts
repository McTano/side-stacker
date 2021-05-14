import { produce } from "immer"
import {
  BoardSide,
  CellState,
  GameAction,
  playMovePayload,
  RootState,
  Token,
} from "./types"

export const gameReducer = (
  state: RootState,
  action: GameAction
): RootState => {
  switch (action.type) {
    case "START_GAME":
      const proof: typeof action["type"] extends "START_GAME" ? 1 : never = 1
      return produce((draftState): void => {
        const { myToken, myTurn } = action.payload
        draftState.game = { status: "PLAYING", myToken, myTurn }
      })(state)
    case "PLAY_MOVE":
      return playMove(state, action.payload)
    case "YOU_WIN":
      return produce((draftState: RootState) => {
        draftState.game = { status: "GAME_OVER", won: true }
      })(state)

    case "YOU_LOSE":
      return produce((draftState: RootState) => {
        const {
          lastMove: { side, row, token },
        } = action.payload
        pushToRow(draftState.board[row], side, token)
        draftState.game = { status: "GAME_OVER", won: false }
      })(state)
    default:
      console.error("unimplemented action: ", action, state)
      return state
  }
}

export const playMove = (
  state: RootState,
  { side, row, token }: playMovePayload
): RootState => {
  return produce((draftState: RootState): void => {
    if (draftState.game.status === "PLAYING") {
      pushToRow(draftState.board[row], side, token)
      draftState.game.myTurn = !draftState.game.myTurn
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
