import React, { Fragment, useEffect, useReducer, useState } from "react"
import BoardView from "./Board"
import "./App.css"
import { RootState, Token } from "./types"
import { GameAction, playMove } from "./actions"
import { connect } from "http2"
import produce from "immer"
import { emptyBoard } from "./util"

type ConnectionState =
  | { status: "WAITING" }
  | { status: "CONNECTED"; userID: number }

const initialState: RootState = {
  board: emptyBoard(),
  game: { status: "WAITING_FOR_MATCH" },
}

const gameReducer = (state: RootState, action: GameAction): RootState => {
  switch (action.type) {
    case "START_GAME":
      return produce((draftState): void => {
        const { myToken, myTurn } = action.payload
        draftState.game = { status: "PLAYING", myToken, myTurn }
      })(state)
    case "playMove":
      return playMove(state, action.payload)
    default:
      console.error("unimplemented action: ", action, state)
      return state
  }
}

const ws = new WebSocket("ws://localhost:8080")

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const { board, game } = state
  const [connection, setConnectionState] = useState<ConnectionState>({
    status: "WAITING",
  })
  console.log(connection, game)
  useEffect(() => {
    ws.onopen = (event) => {
      console.log("websocket connected")
      console.log(event)
    }
    ws.onmessage = (msg) => {
      if (msg.type === "message") {
        let contents
        try {
          contents = JSON.parse((msg as any).data)

          console.log(contents)
          switch (contents.status) {
            case "CONNECTED":
              setConnectionState({
                status: "CONNECTED",
                userID: contents.userID,
              })
              break
            //   break
            case "START_GAME":
              const { myTurn, myToken } = contents
              dispatch({ type: "START_GAME", payload: { myTurn, myToken } })
              break
            default:
              setConnectionState(contents)
              console.warn("received unrecognized utf8 msg ", contents)
          }
        } catch (e) {
          console.error(e)
          console.info(msg)
          return
        }
      } else {
        console.warn("received unknown msg type: ", msg)
      }
    }
  }, [])
  return (
    <div className="App">
      {/* display user id */}
      <h3>
        {connection.status === "WAITING"
          ? "Waiting"
          : "Connected as Player " + connection.userID}
      </h3>
      {connection.status === "CONNECTED" &&
        game.status === "WAITING_FOR_MATCH" && <h3>Waiting for Match</h3>}
      {game.status === "PLAYING" && (
        <h2>{game.myTurn ? "Your" : "Opponent's"} Turn</h2>
      )}
      {(game.status === "PLAYING" || game.status === "GAME_OVER") && (
        <BoardView {...{ game, board, dispatch }} />
      )}
      {/* winner notification */}
      <h1>
        {game.status === "GAME_OVER" && (game.won ? "Victory" : "Defeat")}
      </h1>
    </div>
  )
}

export default App
