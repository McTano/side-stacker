import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"
import { playMove } from "./actions"
import { BoardState, GameState } from "./types"

// test("renders learn react link", () => {
//   render(<App />)
//   const linkElement = screen.getByText(/learn react/i)
//   expect(linkElement).toBeInTheDocument()
// })

const exampleBoard: BoardState = [
  ["X", "_", "X", "O", "O", "O", "O"], // row 0
  ["_", "_", "_", "_", "_", "_", "_"],
  ["X", "_", "_", "_", "_", "O", "O"],
  ["_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "X"],
  ["_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_"],
]

test("playmove action works properly", () => {
  const stateBefore: GameState = {
    p1Turn: true,
    board: exampleBoard,
  }
  const actual = playMove(stateBefore, {
    side: "L",
    token: "O",
    row: 2,
  })
  const expected = [
    ["X", "_", "X", "O", "O", "O", "O"],
    ["_", "_", "_", "_", "_", "_", "_"],
    ["X", "O", "_", "_", "_", "O", "O"], // added an O to left stack
    ["_", "_", "_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_", "_", "X"],
    ["_", "_", "_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_", "_", "_"],
  ]

  expect(actual).toEqual(expected)
})
