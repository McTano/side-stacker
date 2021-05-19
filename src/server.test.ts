import { assert } from "console"
import { BOARD_HEIGHT } from "./constants"
import { emptyBoard, getRandomMove } from "./util"

test("randomMove returns a valid random move", () => {
  const botMove = getRandomMove("X", emptyBoard())
  expect(botMove.row).toBeLessThanOrEqual(BOARD_HEIGHT - 1)
  expect(botMove.side === "L" || botMove.side === "R").toBe(true)
  expect(botMove.token).toBe("X")
})
