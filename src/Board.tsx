import React, { Dispatch, FC } from "react"
import { GameAction } from "./actions"
import { BoardState } from "./types"

type Props = {
  rows: BoardState
  dispatch: Dispatch<GameAction>
}

const activePlayerToken = "X"

const BoardView: FC<Props> = ({ rows, dispatch }) => {
  return (
    <table>
      <tbody>
        {rows.map((row, rowNum) => (
          <tr key={rowNum}>
            {[
              <button
                onClick={(event) =>
                  dispatch({
                    type: "playMove",
                    payload: {
                      row: rowNum,
                      side: "L",
                      token: activePlayerToken,
                    },
                  })
                }
              >
                {"=>"}
              </button>,
              ...row.map((cell, cellNum) => <td key={cellNum}>{cell}</td>),
              <button>{"<="}</button>,
            ]}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BoardView
