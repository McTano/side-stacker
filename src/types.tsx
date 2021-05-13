// export enum CellState {
//   _ = "_",
//   X = "X",
//   O = "O",
// }

import { EnumMember } from "typescript"

export const Players = {
  P1: { token: "X" },
  P2: { token: "O" },
} as const

export type Token = "X" | "O"

export type CellState = "_" | Token

export type BoardSide = "L" | "R"

export type BoardState = CellState[][]

type GameState =
  | { status: "WAITING_FOR_MATCH" }
  | { status: "PLAYING"; myToken: Token; myTurn: boolean }
  | { status: "GAME_OVER"; won: boolean }

export type RootState = {
  game: GameState
  board: BoardState
}
