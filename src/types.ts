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

export type GameState =
  | { status: "WAITING_FOR_MATCH" }
  | { status: "PLAYING"; myToken: Token; myTurn: boolean }
  | { status: "GAME_OVER"; won: boolean }

export type RootState = {
  game: GameState
  board: BoardState
}

export type ClientMessage = {
  type: "PLAY_MOVE"
  payload: {
    row: number
    side: BoardSide
    token: Token
    userID: number
  }
}

type GameActionCases =
  | { type: "PLAY_MOVE"; payload: playMovePayload }
  | {
      type: "START_GAME"
      payload: { myTurn: boolean; myToken: Token }
    }

export type GameAction<K = unknown> = GameActionCases & { type: K }

export type playMovePayload = { side: BoardSide; row: number; token: Token }
