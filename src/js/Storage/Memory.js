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

    // 加密
    buffer = this.EncryptString(buffer)

    localStorage.setItem('mem', buffer)
  }

  /**
   * 读取数据
   */
  static MemLoad () {
    let buffer = localStorage.getItem('mem')
    if (!buffer) return

    // 解密
    buffer = this.DecryptString(buffer)

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

  /******************* 简单映射加密 *******************/
  /**
   * 加密buffer
   * @param {string} str
   * @return {string}
   */
  static EncryptString(str) {
    const randomMap = RandomMap.CreateRandomMapping()
    const newStr    = str.split('').map(number => randomMap[number]).join('')
    return newStr + RandomMap.mapValuesToString(randomMap)
  }

  /**
   * 解密buffer
   * @param {string} encryptedStr
   * @return {string}
   */
  static DecryptString(encryptedStr) {
    const randomMap = RandomMap.stringToMapValues(encryptedStr.slice(15))
    encryptedStr    = encryptedStr.slice(0, 15)
    const reverseMapping = Object.fromEntries(Object.entries(randomMap).map(([key, value]) => [value, key]))
    return encryptedStr.split('').map(number => reverseMapping[number]).join('')
  }
}
