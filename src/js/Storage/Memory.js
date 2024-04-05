// noinspection JSUnusedGlobalSymbols

/**
 * 使用LocalStorage做持久化存储
 */
class Memory {
  /**
   * 将数据库写入存储
   */
  static MemSet () {
    let buffer = ''

    // 写入比分
    const normalized = 1e4 + DataBase.score[0] * 1e2 + DataBase.score[1]
    buffer += normalized.toString().substring(1)

    // 写入参数
    buffer += DataBase.AIOrder.toString()
    buffer += DataBase.currentOrder.toString()

    // 写入棋盘
    buffer += DataBase.gameBoard.flat().join('')

    localStorage.setItem('mem', buffer)
  }

  /**
   * 读取数据
   */
  static MemLoad () {
    const buffer = localStorage.getItem('mem')
    if (!buffer) return

    // 读取比分
    DataBase.score[0] = parseInt(buffer.slice(0, 2))
    DataBase.score[1] = parseInt(buffer.slice(2, 4))

    // 读取参数
    DataBase.AIOrder      = parseInt(buffer[4])
    DataBase.currentOrder = parseInt(buffer[5])

    // 读取棋盘
    const boardArray = buffer.slice(6).split('')
    DataBase.gameBoard = Array.from({ length: 3 }, () => boardArray.splice(0, 3).map(Number))
  }
}
