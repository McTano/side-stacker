import React, { useEffect, useReducer, useState } from "react"
import { IMessage } from "websocket"
import { gameReducer } from "./actions"
import "./App.css"
import BoardView from "./Board"
import { ClientMessage, GameAction, RootState, ServerMessage } from "./types"
import { emptyBoard } from "./util"

type ConnectionState =
  | { status: "WAITING" }
  | { status: "CONNECTED"; userID: number }

const initialState: RootState = {
  board: emptyBoard(),
  game: { status: "NOT_STARTED" },
}

const socket = new WebSocket("ws://localhost:8080")

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const { board, game } = state
  const [connection, setConnectionState] = useState<ConnectionState>({
    status: "WAITING",
  })

  const sendMessage = (msg: ClientMessage) => {
    socket.send(JSON.stringify(msg))
  }

  const handleMove = (action: GameAction & { type: "PLAY_MOVE" }) => {
    connection.status === "CONNECTED" &&
      sendMessage({
        type: "PLAY_MOVE",
        payload: { ...action.payload, userID: connection.userID },
      })
  }

  useEffect(() => {
    socket.onopen = (_) => {
      console.log("websocket connected")
    }
    socket.onmessage = (msg: IMessage) => {
      if (msg.type === "message") {
        try {
          const contents: ServerMessage = JSON.parse((msg as any).data)
          console.log(contents)
          switch (contents.status) {
            case "CONNECTED":
              setConnectionState({
                status: "CONNECTED",
                userID: contents.userID,
              })
              break
            case "BOT_CREATED":
            case "START_GAME": {
              const { myTurn, myToken } = contents
              dispatch({ type: "START_GAME", payload: { myTurn, myToken } })
              break
            }
            case "MOVE_PLAYED": {
              // half-second delay to make transition less jarring when playing against AI
              setTimeout(
                () =>
                  dispatch({ type: "PLAY_MOVE", payload: contents.payload }),
                500
              )
              break
            }
            case "YOU_WIN": {
              dispatch({ type: "YOU_WIN" })
              break
            }
            case "YOU_LOSE": {
              setTimeout(
                () =>
                  dispatch({
                    type: "YOU_LOSE",
                    payload: { lastMove: contents.lastMove },
                  }),
                500
              )
              break
            }
            default: {
              setConnectionState(contents)
              console.warn("received unrecognized utf8 msg ", contents)
            }
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
      {connection.status === "CONNECTED" && game.status === "NOT_STARTED" && (
        <>
          <button
            onClick={() =>
              sendMessage({
                type: "PLAY_BOT",
                payload: { userID: connection.userID },
              })
            }
          >
            Play Against AI
          </button>
          <button
            onClick={
              () =>
                sendMessage({
                  type: "PLAY_HUMAN",
                  payload: { userID: connection.userID },
                })
              // TODO Change game state to "WAITING_FOR_MATCH"
            }
          >
            Play against a human
          </button>
        </>
      )}
      {connection.status === "CONNECTED" &&
        game.status === "WAITING_FOR_MATCH" && <h3>Waiting for Match</h3>}
      {game.status === "PLAYING" && (
        <h2>{game.myTurn ? "Your" : "Opponent's"} Turn</h2>
      )}
      {(game.status === "PLAYING" || game.status === "GAME_OVER") && (
        <BoardView {...{ game, board, dispatch, socket, onMove: handleMove }} />
      )}
      {/* winner notification */}
      <h1>
        {game.status === "GAME_OVER" && (game.won ? "Victory" : "Defeat")}
      </h1>
    </div>
  )
}

export default App
