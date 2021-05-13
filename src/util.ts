import { BoardState, CellState, Token } from "./types"
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants"

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
