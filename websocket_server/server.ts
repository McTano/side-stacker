//#!/usr/bin/env node

import http from "http"
import { connection, server as WebSocketServer } from "websocket"
import { pushToRow } from "../src/actions"
import { BoardState, ClientMessage, Token } from "../src/types"
import { emptyBoard } from "../src/util"
import { winCheck } from "../src/victory"

var connectionArray = []
var nextID = Date.now()
var appendToMakeUnique = 1

type Player = {
  userID: number
  opponent: number
  myToken: Token
  connection: connection
  matchID: number
}

var httpServer = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url)
  response.writeHead(404)
  response.end()
})

const port = 8080

httpServer.listen(port, function () {
  console.log(new Date() + `Server is listening on port ${8080}`)
})

// Create the WebSocket server
console.log("***CREATING WEBSOCKET SERVER")

var wsServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: true,
})
console.log("***CREATED")

type UnpairedPlayer = Pick<Player, "userID" | "connection">

const clients: { [playerID: number]: Player } = {}
const pairingQueue: UnpairedPlayer[] = []
const matches: { [matchID: number]: any } = {}

let nextUserID = 1
const getUserID = () => nextUserID++

let nextMatchID = 1
const getMatchID = () => nextMatchID++

const tryToPair = (player: UnpairedPlayer) => {
  if (pairingQueue.length >= 1) {
    const partner = pairingQueue.shift() as UnpairedPlayer
    const matchID = getMatchID()
    const p1: Player = {
      ...player,
      matchID,
      userID: player.userID,
      opponent: partner.userID,
      myToken: "X",
    }
    const p2: Player = {
      ...partner,
      matchID,
      userID: partner.userID,
      opponent: player.userID,
      myToken: "O",
    }
    player.connection.sendUTF(
      JSON.stringify({
        status: "START_GAME",
        userID: player.userID,
        myToken: "X",
        myTurn: true,
        matchID,
      })
    )
    partner.connection.sendUTF(
      JSON.stringify({
        status: "START_GAME",
        userID: partner.userID,
        myTurn: false,
        myToken: "O",
        matchID,
      })
    )
    clients[p1.userID] = p1
    clients[p2.userID] = p2

    matches[matchID] = {
      p1: player.userID,
      p2: partner.userID,
      board: emptyBoard(),
    }
  } else {
    pairingQueue.push(player)
  }
}

wsServer.on("request", function (request) {
  console.log(
    new Date() +
      " Recieved a new connection from origin " +
      request.origin +
      "."
  )
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null as any, request.origin)
})

wsServer.on("connect", function (connection: connection) {
  console.log("received connection from ", connection.remoteAddress)
  var userID = getUserID()
  const player = { connection, userID }
  connection.send(JSON.stringify({ status: "CONNECTED", userID }))
  tryToPair(player)
  console.log("connected: " + userID)

  connection.on("message", (message) => {
    if (message.type === "utf8" && message.utf8Data != null) {
      const data: ClientMessage = JSON.parse(message.utf8Data)
      console.log(data)
      switch (data.type) {
        case "PLAY_MOVE": {
          const { side, row, userID, token } = data.payload
          const player: Player = clients[userID]
          const board: BoardState = matches[player.matchID].board
          const otherPlayer: Player = clients[player.opponent]
          pushToRow(board[row], side, token)
          const playerWins = winCheck(board, token)
          if (playerWins) {
            player.connection.send(JSON.stringify({ status: "YOU_WIN" }))
            otherPlayer.connection.send(
              JSON.stringify({
                status: "YOU_LOSE",
                lastMove: { side, row, token },
              })
            )
          } else {
            otherPlayer.connection.send(
              JSON.stringify({
                status: "MOVE_PLAYED",
                payload: { side, row, token },
              })
            )
          }

          break
        }
        default:
          console.warn("Unrecognized message from client:", data)
      }
    }
    console.log("received message", message)
  })
})
