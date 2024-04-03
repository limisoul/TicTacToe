// noinspection JSUnusedGlobalSymbols

class GuiAnimator {
  /**
   * 使用高斯模糊显示div
   * @param {HTMLDivElement} div
   */
  static ShowElement(div) {
    div.style.opacity = '1'
    div.style.filter  = 'blur(0)'

    // 修改大小但保持其他属性不变
    const matrix = this.TransformToMatrix(div)
    matrix[0] = 1
    matrix[3] = 1
    div.style.transform = 'matrix(' + matrix.join(', ') + ')'
  }

  /**
   * 使用高斯模糊隐藏div
   * @param {HTMLDivElement} div
   */
  static HiddenElement(div) {
    div.style.opacity = '0'
    div.style.filter  = 'blur(20px)'

    // 修改大小但保持其他属性不变
    const matrix = this.TransformToMatrix(div)
    matrix[0] = .8
    matrix[3] = .8
    div.style.transform = 'matrix(' + matrix.join(', ') + ')'
  }

  /**
   * 将div里的transform属性解析为Matrix
   * @param {HTMLDivElement} div
   * @return {Number[]}
   */
  static TransformToMatrix(div) {
    const TransformValue = window.getComputedStyle(div).getPropertyValue('transform')
    return TransformValue.match(/^matrix\((.+)\)$/)[1].split(',').map(parseFloat)
  }
}

/**
 * 创建棋盘线
 * @param {HTMLDivElement} div
 */
const CreateGameBoardLine = function(div) {
  const BaseLine = function () {
    const div = document.createElement('div')
    div.style.position     = 'absolute'
    div.style.background   = getComputedStyle(document.documentElement).getPropertyValue('--highlight_color')
    div.style.borderRadius = '3px'
    div.style.transition   = '.8s ease-in-out'

    return div
  }

  /**
   * @param {HTMLDivElement} div
   * @param {Number[]} position
   * @param {boolean} scale
   */
  const SetTransform = function (div, position, scale) {
    div.style.left      = position[0] + 'px'
    div.style.top       = position[1] + 'px'
    div.style.width     =  scale ? '100%' : '6px'
    div.style.height    = !scale ? '100%' : '6px'
    div.style.transform = `matrix(${scale ? .001 : 1}, 0, 0, ${scale ? 1 : .001}, 0, 0)` // .001适配Chrome内核
  }

  const Line = []
  for (let i = 0; i < 4; i++) {
    Line.push(BaseLine())

    setTimeout(() => {
      Line[i].style.transform = 'matrix(1, 0, 0, 1, 0, 0)'
    }, 20)

    div.appendChild(Line[i])
  }

  SetTransform(Line[0], [0, 146], true)
  SetTransform(Line[1], [0, 298], true)
  SetTransform(Line[2], [146, 0], false)
  SetTransform(Line[3], [298, 0], false)
}
