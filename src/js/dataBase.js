// noinspection JSUnusedGlobalSymbols
// 依赖项：Vector2.js, unionFind.js

class DataBase {
  static isAudioPlay = true
  // 0表示没有AI，1为AI先手，2为AI后手
  static AIOrder = 0
  // 棋盘 Number[3][3]
  static gameBoard = Array(3).fill(undefined, undefined, undefined).map(() => Array(3).fill(0))

  // 当前回合，1为先手方，2为后手方
  static currentOrder = 1

  // 本局结束
  static isGameEnd = false

  /**
   * 检查棋盘目标格是否为空
   * @param {Vector2} position
   * @return {boolean}
   */
  static PlaceIsEmpty(position) {
    return this.gameBoard[position.y][position.x] === 0
  }

  /**
   * 将插入位置写入gameBoard
   * @param {Vector2} position
   */
  static SetChess(position) {
    this.gameBoard[position.y][position.x] = this.currentOrder
  }

  /**
   * 切换先后手
   */
  static SwitchRounds() {
    this.currentOrder ^= 3
  }

  /**
   * 检查棋盘上是否还有空位
   * @return {boolean}
   */
  static GameBoardHasEmpty() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.gameBoard[i][j] === 0) return true
      }
    }
    return false
  }

  /**
   * 检查当前方是否胜利
   * @return {boolean}
   */
  static currIsWin() {
    const board = this.gameBoard
    const curr  = this.currentOrder
    const uf    = new UnionFind(9)

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === curr) {
          let index = 3 * i + j
          if (i < 2 && board[i + 1][j] === curr) {
            uf.union(index, index + 3)
          }
          if (j < 2 && board[i][j + 1] === curr) {
            uf.union(index, index + 1)
          }
          if (i === j && i < 2 && board[i + 1][j + 1] === curr) {
            uf.union(index, index + 4)
          }
          if (i + j === 2 && i < 2 && board[i + 1][j - 1] === curr) {
            uf.union(index, index + 2)
          }
        }
      }
    }

    // 胜利条件
    const wins = [
      // 横向
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // 竖直
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // 斜线
      [0, 4, 8],
      [2, 4, 6]
    ]

    for (let win of wins) {
      if (uf.connected(win[0], win[1]) && uf.connected(win[1], win[2])) {
        return true
      }
    }

    return false
  }
}
