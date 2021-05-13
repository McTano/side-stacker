import React, { Dispatch, FC } from "react"
import { GameAction } from "./actions"
import { BoardState, CellState, RootState, Token } from "./types"

type Props = RootState & {
  dispatch: Dispatch<GameAction>
  game: { status: "PLAYING" | "GAME_OVER" }
}

const rowFull = (row: CellState[]) => row.every((cell) => cell !== "_")

const BoardView: FC<Props> = ({ board, game, dispatch }) => {
  const shouldDisable = (row: CellState[]): boolean =>
    game.status === "GAME_OVER" || !game.myTurn || rowFull(row)
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
                  onClick={(event) =>
                    dispatch({
                      type: "playMove",
                      payload: {
                        row: rowNum,
                        side: "L",
                      },
                    })
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
                  onClick={(event) =>
                    dispatch({
                      type: "playMove",
                      payload: {
                        row: rowNum,
                        side: "R",
                      },
                    })
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
