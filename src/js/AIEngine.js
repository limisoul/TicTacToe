// noinspection JSUnusedGlobalSymbols

/**
 * 极大极小树
 * @param {number[][]} node
 * @param {number} depth
 * @param {boolean} isMaximizingPlayer
 * @param {number} alpha
 * @param {number} beta
 * @param {number} player
 * @return {number}
 */
function minimax(node, depth, isMaximizingPlayer, alpha, beta, player) {
  if (depth === 0 || isGameOver(node, player)) {
    return evaluateBoard(node, player)
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity
    for (const child of getChildren(node, player)) {
      const eval = minimax(child, depth - 1, false, alpha, beta, player) / 2
      maxEval = Math.max(maxEval, eval)
      alpha = Math.max(alpha, eval)
      if (beta <= alpha) {
        break
      }
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const child of getChildren(node, player ^ 3)) {
      const eval = minimax(child, depth - 1, true, alpha, beta, player) / 2
      minEval = Math.min(minEval, eval)
      beta = Math.min(beta, eval)
      if(beta <= alpha) {
        break
      }
    }
    return minEval
  }
}


/**
 * 计算分数
 * @param {number[][]} board
 * @param {number} player
 * @return {number}
 */
function evaluateBoard(board, player) {
  if (DataBase.currIsWin(board, player)) {
    return 10
  } else if (DataBase.currIsWin(board, player ^ 3)) {
    return -10
  } else {
    return 0
  }
}


/**
 * 获取所有可能的子盘
 * @param {number[][]} board
 * @param {number} player
 * @return {[number[][]]}
 */
function getChildren(board, player) {
  const children = []
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === 0) {
        const newBoard = board.map(function(arr) {
          return arr.slice()
        })
        newBoard[i][j] = player
        children.push(newBoard)
      }
    }
  }
  return children
}


/**
 * 判断游戏是否结束
 * @param {Number[][]} board
 * @param {number} player
 * @return {boolean}
 */
function isGameOver(board, player) {
  return evaluateBoard(board, player) !== 0 || board.every(row => row.every(cell => cell !== 0))
}


/**
 * 计算最佳落子
 * @param {number[][]} board
 * @param player
 * @return {number[][]}
 */
function bestMove(board, player) {
  let bestEval = -Infinity
  let move
  for (const child of getChildren(board, player)) {
    const eval = minimax(child, 5, false, -Infinity, Infinity, player) // 假设AI是极大化玩家
    if (eval > bestEval) {
      bestEval = eval
      move = child // 储存最好的移动
    }
  }
  return move
}


/**
 * 左旋整个棋盘
 * @param {number[][]} board
 * @param {number} n 旋转次数
 * @return {number[][]}
 */
function rotateLeft(board, n) {
  n = n % 4
  const length = 3
  while (n-- > 0) {
    const newBoard = []
    for (let j = 0; j < length; j++) {
      newBoard.push(board.map(row => row[length - j - 1]))
    }
    board = newBoard
  }
  return board
}

// 测试用例
// let currentBoard = [
//   [0, 1, 0],
//   [2, 1, 0],
//   [0, 0, 2]
// ]
// let currentBoard = [
//   [0, 0, 0],
//   [0, 1, 0],
//   [0, 0, 0]
// ]
// let currentBoard = [
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 0]
// ]
// const player = 1
// const times  = Math.floor(Math.random() * 4)
//
// // 将棋盘旋转后再进行计算，增加随机性（例如初始时“X”落子正中）
// currentBoard = rotateLeft(currentBoard, times)
// let boardWithBestMove = bestMove(currentBoard, player)
// boardWithBestMove = rotateLeft(boardWithBestMove, 4 - times)
//
// console.log(boardWithBestMove)
