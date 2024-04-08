// noinspection JSUnusedGlobalSymbols

/**
 * 极大极小树
 * @param {number[][]} node 节点
 * @param {number} depth 遍历深度
 * @param {boolean} isMaximizingPlayer 是否为极大化
 * @param {number} alpha
 * @param {number} beta
 * @param {number} player 需要判别的先后方，1或2
 * @return {number} 分数
 */
function Minimax(node, depth, isMaximizingPlayer, alpha, beta, player) {
  if (depth === 0 || IsGameOver(node, player)) {
    return EvaluateBoard(node, player)
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity
    for (const child of GetChildren(node, player)) {
      const eval = Minimax(child, depth - 1, false, alpha, beta, player) / 2
      maxEval = Math.max(maxEval, eval)
      alpha = Math.max(alpha, eval)
      if (beta <= alpha) {
        break
      }
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const child of GetChildren(node, player ^ 3)) {
      const eval = Minimax(child, depth - 1, true, alpha, beta, player) / 2
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
 * @param {number[][]} board 判别盘面
 * @param {number} player 需要判别的先后方，1或2
 * @return {number} 分数
 */
function EvaluateBoard(board, player) {
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
 * @param {number[][]} board 所需盘面
 * @param {number} player 下一步的先后方，1或2
 * @return {[number[][]]} 所有下一步可以走的盘面
 */
function GetChildren(board, player) {
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
function IsGameOver(board, player) {
  return EvaluateBoard(board, player) !== 0 || board.every(row => row.every(cell => cell !== 0))
}


/**
 * 计算最佳落子
 * @param {number[][]} board 当前盘面
 * @param player 需要计算的先后方，1或2
 * @return {number[][]} 最佳位置的盘面
 */
function BestMove(board, player) {
  let bestEval = -Infinity
  let move
  for (const child of GetChildren(board, player)) {
    const eval = Minimax(child, 5, false, -Infinity, Infinity, player) // 假设AI是极大化玩家
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
 * @return {number[][]} 旋转后的棋盘
 */
function RotateLeft(board, n) {
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
