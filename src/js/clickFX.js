// noinspection JSUnusedGlobalSymbols
// 本文件依赖项：time.js, vector2.js

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
