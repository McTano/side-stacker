// export enum CellState {
//   _ = "_",
//   X = "X",
//   O = "O",
// }

export type CellState = "_" | "X" | "O"

export type BoardSide = "L" | "R"

export type BoardState = CellState[][]

export type GameState = {
  board: BoardState
  p1Turn: boolean
}
