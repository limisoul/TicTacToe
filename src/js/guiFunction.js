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
