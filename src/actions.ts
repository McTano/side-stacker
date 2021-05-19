import { produce } from "immer"
import { BoardState, CellState, GameAction, Move, RootState } from "./types"

export const gameReducer = (
  state: RootState,
  action: GameAction
): RootState => {
  switch (action.type) {
    case "START_GAME":
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
        const { lastMove } = action.payload
        applyMove(draftState.board, lastMove)
        draftState.game = { status: "GAME_OVER", won: false }
      })(state)
    default:
      console.error("unimplemented action: ", action, state)
      return state
  }
}

export const playMove = (state: RootState, move: Move): RootState => {
  return produce((draftState: RootState): void => {
    if (draftState.game.status === "PLAYING") {
      applyMove(draftState.board, move)
      draftState.game.myTurn = !draftState.game.myTurn
    }
    // should be impossible
    else {
      console.error("Tried to play move out of valid turn")
    }
  })(state)
}

export const rowFull = (row: CellState[]) =>
  row.every((cell: CellState) => cell !== "_")

// mutates row in place
// assume:
// - all blanks are in the middle
export const applyMove = (
  board: BoardState,
  { row: rowIndex, side, token }: Move
): void => {
  const row = board[rowIndex]
  if (rowFull(row)) {
    throw new Error("Row is full.")
  } else {
    for (let i = 0; i < row.length; i++) {
      const col = side === "R" ? row.length - 1 - i : i
      if (row[col] === "_") {
        row[col] = token
        return
      }
    }
  }
}
