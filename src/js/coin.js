// noinspection JSUnusedGlobalSymbols
// 依赖项：icon.js, style.css, vector2.js, guiFunction.js

class CoinController {
  constructor() {
    const div = document.createElement('div')
    div.setAttribute('class', 'coin')
    div.style.transition = '.4s ease-in-out'
    div.innerHTML = `
      <div class="coinFace" style="color: var(--main_color_1)">${Unicode.coin}</div>
      <div class="coinFace" style="color: var(--main_color_2);
        transform: translate(-50%, -50%) rotateY(180deg);">${Unicode.coin}</div>
    `

    this.div = div
    this.rotateSpeed    = Vector2.Mul(Vector2.one, 32)
    this.choose = Math.random() > .5 ? 2 : 1 // 选择的先后手
    this.rotatePosition = (this.choose - 1) ? new Vector2(0, 180) : new Vector2(180, 0)
    this.animationEnd = false

    document.body.appendChild(div)

    setInterval(() => {
      this.FixedUpdate()
    }, Time.fixedTime)
  }

  FixedUpdate() {
    this.rotatePosition = Vector2.Add(this.rotatePosition, this.rotateSpeed)
    this.rotateSpeed    = Vector2.Lerp(this.rotateSpeed, Vector2.zero, Time.fixedTime * 16)

    this.div.children[0].style.transform = `translate(-50%, -50%) rotateY(${this.rotatePosition.x}deg)`
    this.div.children[1].style.transform = `translate(-50%, -50%) rotateY(${this.rotatePosition.y}deg)`

    if (this.rotateSpeed.x === 0) {
      setTimeout(() => {
        GuiAnimator.HiddenElement(this.div)
        this.animationEnd = true
      }, 400)
    }
  }
}
