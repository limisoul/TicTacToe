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
   * @return {boolean} 是否读取成功
   */
  static MemLoad () {
    if (!this.isSaved) return false

    let buffer = localStorage.getItem('mem')

    // 解密
    buffer = this.DecryptString(buffer)

    // 数据暂存缓存，先用于校验
    const cache = {
      score: [
        parseInt(buffer.slice(0, 2)),
        parseInt(buffer.slice(2, 4))
      ],
      AIOrder: parseInt(buffer[4]),
      currentOrder: parseInt(buffer[5]),
      boardArray: buffer.slice(6)
    }
    if (!this.DataValidation(cache)) {
      return false
    }

    // 读取比分
    DataBase.score[0] = cache.score[0]
    DataBase.score[1] = cache.score[1]

    // 读取参数
    DataBase.AIOrder      = cache.AIOrder
    DataBase.currentOrder = cache.currentOrder

    // 读取棋盘
    const boardArray = cache.boardArray.split('')
    DataBase.gameBoard = Array.from({ length: 3 }, () => boardArray.splice(0, 3).map(Number))
    return true
  }

  /**
   * 数据校验
   * @param {{}} data
   * @return {boolean}
   */
  static DataValidation(data) {
    // 分数校验
    if (data.score[0] > 99 || data.score[0] < 0 ||
        data.score[1] > 99 || data.score[1] < 0) {
          return false
    }

    // 参数校验
    if (!/^[0-2]$/.test(data.AIOrder) || !/^[12]$/.test(data.currentOrder)) {
      return false
    }

    // 棋盘校验
    if (!/^[0-2]*$/.test(data.boardArray)) {
      return false
    }

    return true
  }

  /**
   * 是否有存储
   * @return {boolean}
   */
  static get isSaved () {
    return Boolean(localStorage.getItem('mem'))
  }

  /**
   * 清除存储
   */
  static Destroy () {
    localStorage.removeItem('mem')
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
