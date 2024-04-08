// noinspection JSUnusedGlobalSymbols

class Vector2 {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * 向量归一化
   * @returns {Vector2}
   */
  get Normalized() {
    const maxVal = Math.max(Math.abs(this.x), Math.abs(this.y))

    if (maxVal === 0) return Vector2.zero

    return Vector2.Div(this, maxVal)
  }

  /**
   * 计算两点间的距离
   * @param {Vector2} a
   * @param {Vector2} b
   * @returns {number}
   */
  static Distance(a, b = Vector2.zero) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
  }

  /**
   * 计算点积: x1x2 * y1y2
   * @param {Vector2} a
   * @param {Vector2} b
   * @returns {number}
   */
  static DotProduct(a, b) {
    return a.x * b.x + a.y * b.y
  }

  /**
   * 计算叉乘: x1y2 - x2y1
   * @param {Vector2} a
   * @param {Vector2} b
   * @returns {number}
   */
  static CrossProduct(a, b) {
    return a.x * b.y - a.y * b.x
  }

  /**
   * 向目标点线性插值(delta)
   * @param {Vector2} currentPosition 当前坐标
   * @param {Vector2} targetPosition 目标坐标
   * @param {number} deltaTime 毫秒数
   * @returns {Vector2}
   */
  static Lerp(currentPosition, targetPosition, deltaTime) {
    const delta = deltaTime / 1000
    if (Math.abs(Vector2.Distance(currentPosition, targetPosition)) <= delta) {
      return targetPosition
    }
    const dire = Vector2.Sub(targetPosition, currentPosition)
    return Vector2.Add(currentPosition, Vector2.Mul(dire.Normalized, delta))
  }

  /***************** 标准构造 *****************/
  /**
   * Vector2 (0, 0)
   * @returns {Vector2}
   */
  static get zero() {
    return new Vector2(0, 0)
  }

  /**
   * Vector2 (1, 1)
   * @returns {Vector2}
   */
  static get one() {
    return new Vector2(1, 1)
  }

  /**
   * Vector2 (-1, 0)
   * @returns {Vector2}
   */
  static get left() {
    return new Vector2(-1, 0)
  }

  /**
   * Vector2 (1, 0)
   * @returns {Vector2}
   */
  static get right() {
    return new Vector2(1, 0)
  }

  /**
   * Vector2 (0, -1)
   * @returns {Vector2}
   */
  static get up() {
    return new Vector2(0, -1)
  }

  /**
   * Vector2 (0, 1)
   * @returns {Vector2}
   */
  static get down() {
    return new Vector2(0, 1)
  }

  /***************** 运算 *****************/
  /**
   * 坐标相加
   * @param {Vector2} a
   * @param {Vector2} b
   * @returns {Vector2}
   */
  static Add(a, b) {
    return new Vector2(a.x + b.x, a.y + b.y)
  }

  /**
   * 坐标相减
   * @param {Vector2} a
   * @param {Vector2} b
   * @returns {Vector2}
   */
  static Sub(a, b) {
    return new Vector2(a.x - b.x, a.y - b.y)
  }

  /**
   * 向量乘值
   * @param {Vector2} v Vector2
   * @param {number} n Number
   * @returns {Vector2}
   */
  static Mul(v, n) {
    return new Vector2(v.x * n, v.y * n)
  }

  /**
   * 向量除值
   * @param {Vector2} v Vector2
   * @param {number} n Number
   * @returns {Vector2}
   */
  static Div(v, n) {
    return new Vector2(v.x / n, v.y / n)
  }

  toString() {
    return  `X:${this.x.toFixed(3)}` +
      `${'&nbsp;'.repeat(2)}` +
      `Y:${this.y.toFixed(3)}`
  }
}
