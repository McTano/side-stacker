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
  | { status: "NOT_STARTED" }
  | { status: "WAITING_FOR_MATCH" }
  | { status: "PLAYING"; myToken: Token; myTurn: boolean }
  | { status: "GAME_OVER"; won: boolean }

export type RootState = {
  game: GameState
  board: BoardState
}

export type ClientMessage =
  | {
      type: "PLAY_MOVE"
      payload: {
        row: number
        side: BoardSide
        token: Token
        userID: number
      }
    }
  | { type: "PLAY_BOT"; payload: { userID: number } }
  | { type: "PLAY_HUMAN"; payload: { userID: number } }

export type ServerMessage =
  | { status: "YOU_LOSE"; lastMove: Move }
  | { status: "YOU_WIN" }
  | { status: "MOVE_PLAYED"; payload: Move }
  | {
      status: "START_GAME"
      myTurn: boolean
      myToken: Token
    }
  | { status: "BOT_CREATED"; myToken: Token; myTurn: boolean }
  | { status: "CONNECTED"; userID: number }

type GameActionCases =
  | { type: "PLAY_MOVE"; payload: Move }
  | {
      type: "START_GAME"
      payload: { myTurn: boolean; myToken: Token }
    }
  | {
      type: "YOU_WIN"
    }
  | {
      type: "YOU_LOSE"
      payload: { lastMove: Move }
    }

export type GameAction<K = unknown> = GameActionCases & { type: K }

export type Move = { side: BoardSide; row: number; token: Token }
