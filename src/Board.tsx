import React, { Dispatch, FC } from "react"
import { GameAction } from "./actions"
import { BoardState, CellState } from "./types"

type Props = {
  rows: BoardState
  dispatch: Dispatch<GameAction>
  activeToken: "X" | "O"
}

const rowFull = (row: CellState[]) => row.every((cell) => cell !== "_")

const BoardView: FC<Props> = ({ rows, dispatch, activeToken }) => {
  return (
    <table>
      <tbody>
        {rows.map((row, rowNum) => (
          <tr key={rowNum}>
            {[
              // left side buttons
              <button
                disabled={rowFull(row)}
                key={`left-button-${rowNum}`}
                className="left-push-button"
                onClick={(event) =>
                  dispatch({
                    type: "playMove",
                    payload: {
                      row: rowNum,
                      side: "L",
                      token: activeToken,
                    },
                  })
                }
              >
                {"=>"}
              </button>,
              // row contents
              ...row.map((cell, cellNum) => <td key={cellNum}>{cell}</td>),
              // right side button
              <button
                disabled={rowFull(row)}
                key={`right-button-${rowNum}`}
                className="right-push-button"
                onClick={(event) =>
                  dispatch({
                    type: "playMove",
                    payload: {
                      row: rowNum,
                      side: "R",
                      token: activeToken,
                    },
                  })
                }
              >
                {"<="}
              </button>,
            ]}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BoardView
