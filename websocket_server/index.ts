//#!/usr/bin/env node

// Based on NPM

//
// WebSocket chat server
// Implemented using Node.js
//
// Requires the websocket module.
//

// var emptyBoard = require("../src/util.ts").emptyBoard
import http from "http"
import { emptyBoard } from "../src/util"
const fs = require("fs")
const WebSocketServer = require("websocket").server
const util = require("../src/util")

var connectionArray = []
var nextID = Date.now()
var appendToMakeUnique = 1

// Load the key and cert ificate data to be used for our HTTPS/WSS
// server.

// var httpsOptions = {
//   key: fs.readFileSync("/etc/pki/tls/private/mdn-samples.mozilla.org.key"),
//   cert: fs.readFileSync("/etc/pki/tls/certs/mdn-samples.mozilla.org.crt"),
// }

// Our HTTPS server does nothing but service WebSocket
// connections, so every request just returns 404. Real Web
// requests are handled by the main server on the box. If you
// want to, you can return real HTML here and serve Web content.

// var httpsServr = https.createServer(
//   httpsOptions,
//   function (request, response) {
//     console.log(new Date() + " Received request for " + request.url)
//     response.writeHead(404)
//     response.end()
//   }
// )

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

// Adapted this code from https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/
const clients = {}
const pairingQueue: any[] = []
const matches = {}

let nextUserID = 1
const getUserID = () => nextUserID++

let nextMatchID = 1
const getMatchID = () => nextMatchID++

const tryToPair = (player) => {
  if (pairingQueue.length >= 1) {
    const partner = clients[pairingQueue.shift()]
    partner.opponent = player.userID
    player.opponent = partner.userID
    const matchID = getMatchID()
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
    matches[matchID] = {
      p1: player.userID,
      p2: partner.userID,
      board: emptyBoard(),
    }
  } else {
    pairingQueue.push(player.userID)
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
  const connection = request.accept(null, request.origin)
})

wsServer.on("connect", function (connection) {
  console.log("received connection from " + connection.origin)
  var userID = getUserID()
  const player = { connection, userID }
  clients[userID] = player
  connection.send(JSON.stringify({ status: "CONNECTED", userID }))
  tryToPair(player)
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  )

  connection.on("message", (message) => {
    if (message.type === "utf8") {
      const contents = message.utf8Data
    }
    console.log("received message", message)
  })
})

// function originIsAllowed(origin) {
//   // This is where you put code to ensure the connection should
//   // be accepted. Return false if it shouldn't be.
//   return true
// }

// function isUsernameUnique(name) {
//   var isUnique = true
//   var i

//   for (i = 0; i < connectionArray.length; i++) {
//     if (connectionArray[i].username === name) {
//       isUnique = false
//       break
//     }
//   }
//   return isUnique
// }

// function getConnectionForID(id) {
//   var connect = null
//   var i

//   for (i = 0; i < connectionArray.length; i++) {
//     if (connectionArray[i].clientID === id) {
//       connect = connectionArray[i]
//       break
//     }
//   }

//   return connect
// }

// function makeUserListMessage() {
//   var userListMsg = {
//     type: "userlist",
//     users: [],
//   }
//   var i

//   // Add the users to the list

//   for (i = 0; i < connectionArray.length; i++) {
//     userListMsg.users.push(connectionArray[i].username)
//   }

//   return userListMsg
// }

// function sendUserListToAll() {
//   var userListMsg = makeUserListMessage()
//   var userListMsgStr = JSON.stringify(userListMsg)
//   var i

//   for (i = 0; i < connectionArray.length; i++) {
//     connectionArray[i].sendUTF(userListMsgStr)
//   }
// }

// console.log("***CRETING REQUEST HANDLER")
// wsServer.on("request", function (request) {
//   console.log("Handling request from " + request.origin)
//   if (!originIsAllowed(request.origin)) {
//     request.reject()
//     console.log("Connection from " + request.origin + " rejected.")
//     return
//   }

//   // Accept the request and get a connection.

//   var connection = request.accept("json", request.origin)

//   // Add the new connection to our list of connections.

//   console.log(new Date() + " Connection accepted.")
//   connectionArray.push(connection)

//   // Send the new client its token; it will
//   // respond with its login username.

//   connection.clientID = nextID
//   nextID++

//   var msg = {
//     type: "id",
//     id: connection.clientID,
//   }
//   connection.sendUTF(JSON.stringify(msg))

//   // Handle the "message" event received over WebSocket. This
//   // is a message sent by a client, and may be text to share with
//   // other users or a command to the server.

//   connection.on("message", function (message) {
//     console.log("***MESSAGE")
//     if (message.type === "utf8") {
//       console.log("Received Message: " + message.utf8Data)

//       // Process messages

//       var sendToClients = true
//       msg = JSON.parse(message.utf8Data)
//       var connect = getConnectionForID(msg.id)

//       // Look at the received message type and
//       // handle it appropriately.

//       switch (msg.type) {
//         // Public text message in the chat room
//         case "message":
//           msg.name = connect.username
//           msg.text = msg.text.replace(/(<([^>]+)>)/gi, "")
//           break

//         // Username change request
//         case "username":
//           var nameChanged = false
//           var origName = msg.name

//           // Force a unique username by appending
//           // increasing digits until it's unique.
//           while (!isUsernameUnique(msg.name)) {
//             msg.name = origName + appendToMakeUnique
//             appendToMakeUnique++
//             nameChanged = true
//           }

//           // If the name had to be changed, reject the
//           // original username and let the other user
//           // know their revised name.
//           if (nameChanged) {
//             var changeMsg = {
//               id: msg.id,
//               type: "rejectusername",
//               name: msg.name,
//             }
//             connect.sendUTF(JSON.stringify(changeMsg))
//           }

//           connect.username = msg.name
//           sendUserListToAll()
//           break
//       }

//       // Convert the message back to JSON and send it out
//       // to all clients.

//       if (sendToClients) {
//         var msgString = JSON.stringify(msg)
//         var i

//         for (i = 0; i < connectionArray.length; i++) {
//           connectionArray[i].sendUTF(msgString)
//         }
//       }
//     }
//   })

//   // Handle the WebSocket "close" event; this means a user has logged off
//   // or has been disconnected.

//   connection.on("close", function (connection) {
//     connectionArray = connectionArray.filter(function (el, idx, ar) {
//       return el.connected
//     })
//     sendUserListToAll() // Update the user lists
//     console.log(
//       new Date() + " Peer " + connection.remoteAddress + " disconnected."
//     )
//   })
// })
// console.log("***REQUEST HANDLER CREATED")
