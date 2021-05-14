import { playMove } from "./actions"
import { BoardState, RootState } from "./types"

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
  const stateBefore: RootState = {
    game: { status: "PLAYING", myToken: "O", myTurn: true },
    board: exampleBoard,
  }
  const actual = playMove(stateBefore, {
    side: "L",
    token: "O",
    row: 2,
  } as const)
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
    game: { status: "PLAYING", myToken: "O", myTurn: false },
  }
  expect(actual).toEqual(expected)
})

test("playmove works from the right", () => {
  const stateBefore: RootState = {
    game: { status: "PLAYING", myToken: "O", myTurn: true },
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
    game: { myToken: "O", myTurn: false, status: "PLAYING" },
  }

  expect(actual).toEqual(expected)
})
