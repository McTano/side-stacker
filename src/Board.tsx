import React, { Dispatch, FC } from "react"
import {
  BoardSide,
  CellState,
  GameAction,
  playMovePayload,
  RootState,
  Token,
} from "./types"

type Props = RootState & {
  dispatch: Dispatch<GameAction>
  game: { status: "PLAYING" | "GAME_OVER" }
  onMove: (action: GameAction<"PLAY_MOVE">) => void
}

const rowFull = (row: CellState[]) => row.every((cell) => cell !== "_")

const BoardView: FC<Props> = ({ board, game, onMove, dispatch }) => {
  const shouldDisable = (row: CellState[]): boolean =>
    game.status === "GAME_OVER" || !game.myTurn || rowFull(row)
  const handleMove = (side: BoardSide, row: number, token: Token) => {
    const action: GameAction<"PLAY_MOVE"> = {
      type: "PLAY_MOVE",
      payload: {
        row,
        side,
        token,
      },
    }
    dispatch(action)
    onMove(action)
  }
  return (
    <table>
      <tbody>
        {board.map((row, rowNum) => (
          <tr key={rowNum}>
            {[
              // left side button
              <td key={`left-button-${rowNum}`}>
                <button
                  disabled={shouldDisable(row)}
                  className="left-push-button"
                  onClick={(_) =>
                    game.status === "PLAYING" &&
                    handleMove("L", rowNum, game.myToken)
                  }
                >
                  {"=>"}
                </button>
              </td>,
              // row contents
              ...row.map((cell, cellNum) => <td key={cellNum}>{cell}</td>),
              // right side button
              <td key={`right-button-${rowNum}`}>
                <button
                  disabled={shouldDisable(row)}
                  className="right-push-button"
                  onClick={(_) =>
                    game.status === "PLAYING" &&
                    handleMove("R", rowNum, game.myToken)
                  }
                >
                  {"<="}
                </button>
                ,
              </td>,
            ]}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BoardView
