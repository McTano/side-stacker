//#!/usr/bin/env node

import http from "http"
import { send } from "process"
import { connection, IMessage, server as WebSocketServer } from "websocket"
import { applyMove } from "../src/actions"
import {
  BoardState,
  ClientMessage,
  Move,
  ServerMessage,
  Token,
} from "../src/types"
import { emptyBoard, getRandomMove, opposite } from "../src/util"
import { winCheck } from "../src/victory"

type Player = {
  userID: number
  opponent: number | "BOT"
  myToken: Token
  connection: connection
  matchID: number
}

type UnpairedPlayer = Pick<Player, "userID" | "connection">

const httpServer = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url)
  response.writeHead(404)
  response.end()
})

const SERVER_PORT = 8080

httpServer.listen(SERVER_PORT, function () {
  console.log(new Date() + `Server is listening on port ${SERVER_PORT}`)
})

// Create the WebSocket server
console.log("***CREATING WEBSOCKET SERVER")

const wsServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: true,
})
console.log("***CREATED")

const clients: { [playerID: number]: Player } = {}
const unpairedPlayers: { [playerID: number]: UnpairedPlayer } = {}
const pairingQueue: UnpairedPlayer[] = []
const matches: {
  [matchID: number]: {
    p1: number
    p2: number
    board: BoardState
  }
} = {}

let nextUserID = 1
const getUserID = () => nextUserID++

let nextMatchID = 1
const getMatchID = () => nextMatchID++

const sendMessage = (
  player: { connection: connection },
  msg: ServerMessage
) => {
  player.connection.send(JSON.stringify(msg))
}

// notify both players that the game is over
const notifyGameOver = (
  winner: Player | null,
  loser: Player | null,
  lastMove: Move
) => {
  if (winner) {
    sendMessage(winner, { status: "YOU_WIN" })
  }
  if (loser) {
    sendMessage(loser, { status: "YOU_LOSE", lastMove })
  }
}

// play a bot move and end the game if the bot wins
const playBotMove = (board: BoardState, player: Player) => {
  const botToken = opposite(player.myToken)
  const botMove = getRandomMove(botToken, board)
  applyMove(board, botMove)
  const botWins = winCheck(board, botMove.token)
  if (botWins) {
    notifyGameOver(null, player, botMove)
  } else {
    sendMessage(player, {
      status: "MOVE_PLAYED",
      payload: {
        side: botMove.side,
        row: botMove.row,
        token: botMove.token,
      },
    })
  }
}

const handleMove = (move: Move, board: BoardState, currentPlayer: Player) => {
  // check if opponent is bot
  const opponent = getOpponent(currentPlayer)
  const opponentIsBot: boolean = !opponent

  // apply the player's move
  applyMove(board, move)

  // check if the move resulted in a win
  const playerWins: boolean = winCheck(board, move.token)

  if (playerWins) {
    notifyGameOver(currentPlayer, opponent, move)
  } else if (opponentIsBot) {
    playBotMove(board, currentPlayer)
  }
}

const messageHandler = (message: IMessage) => {
  if (message.type === "utf8" && message.utf8Data != null) {
    const data: ClientMessage = JSON.parse(message.utf8Data)
    console.log(data)
    switch (data.type) {
      case "PLAY_MOVE": {
        const { side, row, token, userID } = data.payload
        const player: Player = clients[userID]
        const board: BoardState = matches[player.matchID].board
        handleMove({ side, row, token }, board, player)
        console.log("handled Move")
        break
      }
      case "PLAY_BOT": {
        const { userID } = data.payload
        const player: any = unpairedPlayers[userID]
        player.opponent = "BOT"
        const matchID = getMatchID()
        matches[matchID] = { p1: userID, p2: -1, board: emptyBoard() }
        player.matchID = matchID
        sendMessage(player, {
          status: "BOT_CREATED",
          myTurn: true,
          myToken: "X",
        })
        player.myToken = "X"
        clients[userID] = player
        break
      }
      case "PLAY_HUMAN": {
        const { userID } = data.payload
        const player = unpairedPlayers[userID]
        tryToPair(player)
        break
      }
      default:
        console.warn("Unrecognized message from client:", data)
    }
  }
  console.log("received message", message)
}

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
    sendMessage(player, {
      status: "START_GAME",
      myToken: "X",
      myTurn: true,
    })
    sendMessage(partner, {
      status: "START_GAME",
      myTurn: false,
      myToken: "O",
    })
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
  const userID = getUserID()
  const player = { connection, userID }
  unpairedPlayers[player.userID] = player
  sendMessage(player, { status: "CONNECTED", userID })

  console.log("connected: " + userID)

  connection.on("message", messageHandler)
})
function getOpponent(currentPlayer: Player): Player | null {
  return currentPlayer.opponent === "BOT"
    ? null
    : clients[currentPlayer.opponent]
}
