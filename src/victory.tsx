import { BoardState, CellState, Token } from "./types"
import { BOARD_WIDTH, BOARD_HEIGHT } from "./constants"

// TODO
// Could optimize these checks by only checking if the last move played causes a win.
// I'd have to either keep track of what column the last play ended up in, or check the whole row.

export const winCheck = (...params: [BoardState, Token]) =>
  rowCheck(...params) || colCheck(...params) || diagonalCheck(...params)

export const rowCheck = (rows: BoardState, token: Token) =>
  rows.some((row: CellState[]) => {
    let count = 0
    for (const cell of row) {
      if (cell === token) {
        count += 1
        if (count >= 4) {
          return true
        }
      } else {
        count = 0
      }
    }
    return false
  })

export const colCheck = (rows: BoardState, token: Token): boolean => {
  for (let i = 0; i < BOARD_WIDTH; i++) {
    let count = 0
    for (const row of rows) {
      if (row[i] === token) {
        count += 1
        if (count >= 4) {
          return true
        }
      } else {
        count = 0
      }
    }
  }
  return false
}

export const getCell = (board: BoardState, x: number, y: number) => board[y][x]

// TODO this checks a lot of cells more often than it needs to.
// going right to left, it could stop at x = y
// going the other way, it would be
export const diagonalCheck = (board: BoardState, token: Token): boolean => {
  for (const xOffsetDirection of [1, -1]) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x <= BOARD_WIDTH; x++) {
        let count = 0
        let yOffset = 0
        let xOffset = 0
        while (
          0 <= x + xOffset &&
          x + xOffset < BOARD_WIDTH &&
          y + yOffset < BOARD_HEIGHT
        ) {
          if (getCell(board, x + xOffset, y + yOffset) === token) {
            count += 1
            if (count >= 4) {
              return true
            }
          } else {
            count = 0
          }
          xOffset += xOffsetDirection
          yOffset += 1
        }
      }
    }
  }
  return false
}
