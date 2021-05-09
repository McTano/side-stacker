import { rowCheck, colCheck, diagonalCheck } from "./victory"
import { BoardState } from "./types"

test("victory condition for rows", () => {
  const oWinsByRow: BoardState = [
    ["X", "_", "X", "O", "O", "O", "O"],
    ["_", "_", "_", "_", "_", "_", "_"],
    ["X", "_", "_", "_", "X", "O", "O"],
    ["_", "_", "_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_", "_", "X"],
    ["_", "_", "_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_", "_", "_"],
  ]

  expect(rowCheck(oWinsByRow, "X")).toBe(false)
  expect(rowCheck(oWinsByRow, "O")).toBe(true)
})

test("victory condition for columns", () => {
  const xWinsByCol: BoardState = [
    ["X", "_", "X", "O", "O", "O", "O"],
    ["_", "_", "_", "_", "X", "_", "_"],
    ["X", "_", "_", "_", "X", "O", "O"],
    ["_", "_", "_", "_", "X", "_", "_"],
    ["_", "_", "_", "_", "X", "_", "X"],
    ["_", "_", "_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_", "_", "_"],
  ]

  expect(colCheck(xWinsByCol, "X")).toBe(true)
  expect(colCheck(xWinsByCol, "O")).toBe(false)
})

const xWinsByDiagonal1: BoardState = [
  ["X", "_", "X", "O", "O", "O", "O"],
  ["_", "X", "_", "X", "X", "_", "_"],
  ["X", "_", "X", "_", "O", "O", "O"],
  ["_", "X", "_", "X", "X", "_", "_"],
  ["_", "_", "O", "_", "X", "_", "X"],
  ["_", "O", "_", "_", "_", "X", "_"],
  ["_", "_", "_", "_", "_", "_", "_"],
]

describe("diagonal victory check", () => {
  test("works when diagonal starts in corner", () => {
    expect(diagonalCheck(xWinsByDiagonal1, "X")).toBe(true)
    expect(diagonalCheck(xWinsByDiagonal1, "O")).toBe(false)
  })

  const noWin: BoardState = [
    ["X", "_", "X", "O", "O", "O", "O"],
    ["_", "_", "_", "_", "X", "_", "_"],
    ["X", "_", "_", "_", "_", "O", "O"],
    ["_", "_", "_", "_", "X", "_", "_"],
    ["_", "X", "_", "_", "X", "_", "X"],
    ["_", "X", "X", "_", "_", "_", "_"],
    ["_", "_", "X", "X", "_", "_", "_"],
  ]

  test("returns false when there is no diagonal win", () => {
    expect(diagonalCheck(noWin, "X")).toBe(false)
    expect(diagonalCheck(noWin, "O")).toBe(false)
  })

  const xWinsByDiagonal2: BoardState = [
    ["X", "_", "X", "O", "O", "O", "O"],
    ["_", "_", "_", "X", "X", "_", "_"],
    ["X", "_", "_", "_", "O", "O", "O"],
    ["_", "X", "X", "X", "X", "_", "_"],
    ["_", "_", "O", "X", "_", "_", "X"],
    ["_", "O", "_", "_", "X", "X", "_"],
    ["_", "_", "_", "_", "_", "X", "_"],
  ]

  test("works when diagonal starts further down", () => {
    expect(diagonalCheck(xWinsByDiagonal2, "X")).toBe(true)
    expect(diagonalCheck(xWinsByDiagonal2, "O")).toBe(false)
  })

  const oWinsByDiagonalOppositeDirection: BoardState = [
    ["X", "_", "X", "O", "O", "O", "O"],
    ["_", "_", "_", "X", "X", "_", "_"],
    ["X", "_", "_", "_", "O", "O", "O"],
    ["_", "X", "X", "X", "O", "_", "_"],
    ["_", "_", "O", "O", "_", "_", "X"],
    ["_", "O", "O", "_", "X", "X", "_"],
    ["_", "_", "_", "_", "_", "X", "_"],
  ]

  test("catches diagonals in opposite direction", () => {
    expect(diagonalCheck(oWinsByDiagonalOppositeDirection, "O")).toBe(true)
    expect(diagonalCheck(oWinsByDiagonalOppositeDirection, "X")).toBe(false)
  })

  test("reaches corner at (max x, min y)", () => {
    const cornerCase: BoardState = [
      ["X", "_", "_", "_", "_", "_", "O"], // down and left from this corner
      ["_", "_", "_", "X", "X", "O", "X"],
      ["X", "_", "_", "_", "O", "O", "O"],
      ["_", "X", "X", "O", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "X"],
      ["_", "O", "O", "_", "X", "X", "_"],
      ["_", "_", "_", "_", "_", "X", "_"],
    ]

    expect(diagonalCheck(cornerCase, "O")).toBe(true)
    expect(diagonalCheck(cornerCase, "X")).toBe(false)
  })

  test("reaches corner at (max x, max y)", () => {
    const cornerCase: BoardState = [
      ["_", "_", "_", "_", "_", "_", "X"],
      ["_", "O", "O", "_", "X", "X", "_"],
      ["_", "_", "_", "_", "_", "X", "_"],
      ["X", "_", "_", "_", "_", "_", "O"], // down and left from this side O
      ["_", "_", "_", "X", "X", "O", "X"],
      ["X", "_", "_", "_", "O", "O", "O"],
      ["_", "X", "X", "O", "_", "_", "_"],
    ]
    expect(diagonalCheck(cornerCase, "O")).toBe(true)
    expect(diagonalCheck(cornerCase, "X")).toBe(false)
  })

  test("reaches corner at (min x, max y)", () => {
    const cornerCase: BoardState = [
      ["_", "_", "_", "_", "_", "_", "X"],
      ["_", "O", "O", "_", "X", "X", "_"],
      ["_", "_", "_", "_", "_", "X", "_"],
      ["X", "_", "_", "_", "_", "_", "_"], // down and left from this side O
      ["_", "X", "_", "_", "_", "_", "X"],
      ["X", "_", "X", "_", "O", "O", "O"],
      ["_", "X", "X", "X", "_", "_", "_"],
    ] // up and left   ^ here
    expect(diagonalCheck(cornerCase, "O")).toBe(false)
    expect(diagonalCheck(cornerCase, "X")).toBe(true)
  })
})
