import { BoardState, CellState, Token } from "./types"
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants"
import { rowFull } from "./actions"

// get array representing range
export const range = (n: number): number[] =>
  Array(5)
    .fill(null)
    .map((_, i) => i)

export const emptyBoard = () => {
  const grid: BoardState = []
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    const newRow: CellState[] = new Array(BOARD_WIDTH)
    newRow.fill("_", 0, BOARD_WIDTH)
    grid.push(newRow)
  }
  return grid
}

export const opposite = (sym: Token) => {
  if (sym === "X") {
    return "O"
  } else if (sym === "O") {
    return "X"
  } else {
    throw new TypeError(`Token must be X or O, received: ${sym}`)
  }
}

const rowIndices = range(BOARD_HEIGHT)

// get the indexes of rows which are not full
export const getValidRows = (board: BoardState): number[] =>
  rowIndices.filter((row: number) => !rowFull(board[row]))

// give back a random move
export const getRandomMove = (
  token: Token,
  board: BoardState
): { side: "L" | "R"; row: number; token: Token } => {
  const side: "L" | "R" = getRandomElement(["L", "R"])
  // get the rows which are not already full
  const validRows: number[] = getValidRows(board)
  const row = getRandomElement(validRows)
  return { side, row, token }
}

export const getRandomElement = <T>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)]
