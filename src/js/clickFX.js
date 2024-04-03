// noinspection JSUnusedGlobalSymbols
// 本文件依赖项：time.js

const ParticleNum       = 15 // 粒子数量
const JitterSize        = 5 // 粒子抖动大小（最大尺寸）
const Color             = '#ffcc00' // 粒子色彩
const MovingSpeed       = 3 // 粒子移动速度
const CollapseVelocity  = .1 // 粒子缩小速度
const CollapseLimit     = .2 // 粒子消失界限（最小尺寸）

class ClickFX {
  static particles = []
  static canvas = document.createElement('canvas')
  static ctx    = this.canvas.getContext('2d')

  static CreateCanvas() {
    this.canvas.width  = window.innerWidth
    this.canvas.height = window.innerHeight

    document.body.appendChild(this.canvas)

    window.addEventListener('click', function (event) {
      const mouse = new Vector2(event.clientX, event.clientY)
      for (let _ = 0; _ < ParticleNum; _++) {
        ClickFX.particles.push(new Particle(mouse))
      }
    })
  }

  /**
   * 更新画布
   */
  static FixedUpdate() {
    ClickFX.ctx.clearRect(0, 0, ClickFX.canvas.width, ClickFX.canvas.height)

    // 更新每个粒子
    ClickFX.particles.forEach((particle, index) => {
      particle.FixedUpdate()
      particle.Draw()
      // 如果太小就移除
      if (particle.size <= CollapseLimit) {
        ClickFX.particles.splice(index, 1)
      }
    })
  }
}
ClickFX.CreateCanvas()
setInterval(() => {
  ClickFX.FixedUpdate()
}, Time.fixedTime)


class Particle {
  /**
   * @param {Vector2} position
   */
  constructor(position) {
    this.position = position
    this.size     = Math.random() * JitterSize + 1
    this.speed    = Vector2.Mul(new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1), MovingSpeed)
    this.color    = Color
  }

  /**
   * 粒子位置更新
   */
  FixedUpdate() {
    this.speed.y += .1 // 模拟重力
    this.position = Vector2.Add(this.position, this.speed)
    if (this.size > CollapseLimit) this.size -= CollapseVelocity
  }

  /**
   * 绘制粒子
   */
  Draw() {
    ClickFX.ctx.fillStyle = this.color
    ClickFX.ctx.beginPath()
    ClickFX.ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
    ClickFX.ctx.fill()
  }
}

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
  static Dot_product(a, b) {
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
