import React, { useReducer } from "react"
import BoardView from "./Board"
import "./App.css"
import { BoardState, CellState, GameState } from "./types"
import { GameAction, playMove } from "./actions"
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants"

const emptyBoard = () => {
  const grid: BoardState = []
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    const newRow: CellState[] = new Array(BOARD_WIDTH)
    newRow.fill("_", 0, BOARD_WIDTH)
    grid.push(newRow)
  }
  return grid
}

const initialState: GameState = {
  board: emptyBoard(),
  p1Turn: true,
  winner: undefined,
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
  const [{ board, p1Turn, winner }, dispatch] = useReducer(
    gameReducer,
    initialState
  )
  const activeToken = p1Turn ? "X" : "O"
  return (
    <div className="App">
      {winner ? `${winner} wins!` : <h2> {activeToken}'s Turn</h2>}
      <BoardView
        activeToken={activeToken}
        rows={board}
        winner={winner}
        dispatch={dispatch}
      />
    </div>
  )
}

export default App
