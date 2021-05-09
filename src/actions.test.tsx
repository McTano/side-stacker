import { playMove } from "./actions"
import { BoardState, GameState } from "./types"

const exampleBoard: BoardState = [
  ["X", "_", "X", "O", "O", "O", "O"], // row 0
  ["_", "_", "_", "_", "_", "_", "_"],
  ["X", "_", "_", "_", "_", "O", "O"],
  ["_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "X"],
  ["_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_"],
]

test("playmove works from the left", () => {
  const stateBefore: GameState = {
    p1Turn: false,
    board: exampleBoard,
  }
  const actual = playMove(stateBefore, {
    side: "L",
    token: "O",
    row: 2,
  })
  const expected = {
    board: [
      ["X", "_", "X", "O", "O", "O", "O"],
      ["_", "_", "_", "_", "_", "_", "_"],
      ["X", "O", "_", "_", "_", "O", "O"], // added an O to left stack
      ["_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "X"],
      ["_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_"],
    ],
    p1Turn: true,
    winner: "O",
  }
  expect(actual).toEqual(expected)
})

test("playmove works from the right", () => {
  const stateBefore: GameState = {
    p1Turn: true,
    board: [
      ["X", "_", "X", "O", "O", "O", "O"],
      ["_", "_", "_", "_", "_", "_", "_"],
      ["X", "_", "_", "_", "_", "O", "O"],
      ["_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "X"],
      ["_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_"],
    ],
  }
  const actual = playMove(stateBefore, {
    side: "R",
    token: "X",
    row: 2,
  })
  const expected = {
    board: [
      ["X", "_", "X", "O", "O", "O", "O"],
      ["_", "_", "_", "_", "_", "_", "_"],
      ["X", "_", "_", "_", "X", "O", "O"], // added X to right stack
      ["_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "X"],
      ["_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_"],
    ],
    p1Turn: false,
  }

  expect(actual).toEqual(expected)
})
