import React, { useReducer } from "react"
import BoardView from "./Board"
import "./App.css"
import { BoardState, CellState, GameState } from "./types"
import { GameAction, playMove } from "./actions"
const BOARD_HEIGHT = 7
const BOARD_WIDTH = 7

const emptyBoard = () => {
  const grid: BoardState = []
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    const newRow: CellState[] = new Array(BOARD_WIDTH)
    newRow.fill("_", 0, BOARD_WIDTH)
    grid.push(newRow)
  }
  return grid
}

const initialState = {
  board: emptyBoard(),
  p1Turn: true,
}

const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case "playMove":
      return playMove(state, action.payload)
    default:
      console.error("unimplemented action: ", action, state)
      return state
  }
}

function App() {
  const [{ board, p1Turn }, dispatch] = useReducer(gameReducer, initialState)
  return (
    <div className="App">
      <h2>Player {p1Turn ? 1 : 2}'s Turn</h2>
      <BoardView rows={board} dispatch={dispatch} />
    </div>
  )
}

export default App
