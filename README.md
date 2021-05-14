# Side-Stacker

This project uses TypeScript and React on the frontend.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
In addition to the usual CRA scripts,

`npm start`
`npm test`
`npm run build`
`npm run eject`

you can run the following:
`npm run compile-server` - compiles the server which handles the websocket connections
`npm run start-server` - runs the compiled websocket server
`npm run server` - compiles and builds the server

## Notes and TODOs
- The prompt for this exercise said to use a Relation DB in the backend, but in the interest of time, I skipped that part. For now, the server is just keeping all of the game data in memory. You can play a game between two players as long as the server thread keeps running and neither player refreshes the page.
- If the websocket closes, there's currently no logic to attempt a new connection from the client side or to re-associate the user's ID with the a connection on the server side.
