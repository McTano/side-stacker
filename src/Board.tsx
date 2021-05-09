import React, { Dispatch, FC } from "react"
import { GameAction } from "./actions"
import { BoardState, CellState, Token } from "./types"

type Props = {
  rows: BoardState
  dispatch: Dispatch<GameAction>
  activeToken: Token
  winner?: Token
}

const rowFull = (row: CellState[]) => row.every((cell) => cell !== "_")

const BoardView: FC<Props> = ({ rows, dispatch, activeToken, winner }) => {
  return (
    <table>
      <tbody>
        {rows.map((row, rowNum) => (
          <tr key={rowNum}>
            {[
              // left side buttons
              <td key={`left-button-${rowNum}`}>
                <button
                  disabled={!!!!winner || rowFull(row)}
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
                </button>
              </td>,
              // row contents
              ...row.map((cell, cellNum) => <td key={cellNum}>{cell}</td>),
              // right side button
              <td key={`right-button-${rowNum}`}>
                <button
                  disabled={!!winner || rowFull(row)}
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
