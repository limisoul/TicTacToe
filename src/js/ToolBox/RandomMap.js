// noinspection JSUnusedGlobalSymbols

class RandomMap {
  /**
   * map to string
   * @param {Map} map
   * @return {string}
   */
  static mapValuesToString(map) {
    let str = ''
    for (const key in map) {
      if (map.hasOwnProperty(key)) {
        str += `${map[key]}`
      }
    }
    return str
  }

  /**
   * string to map
   * @param {string} str
   * @return {Map}
   */
  static stringToMapValues(str) {
    const map = {}
    for (let i = 0; i < str.length; i++) {
      map[i.toString()] = parseInt(str[i])
    }
    return map
  }

  /**
   * 创建一个[0-9]的随机映射表
   * @return {Map}
   */
  static CreateRandomMapping() {
    const originalNumbers = [...Array(10).keys()] // [0, 1, 2, ..., 9]
    const shuffledNumbers = [...originalNumbers].sort(() => Math.random() - 0.5) // 随机打乱

    const mapping = {}
    originalNumbers.forEach((number, index) => {
      mapping[number] = shuffledNumbers[index]
    })

    return mapping
  }
}
