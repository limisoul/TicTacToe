// noinspection JSUnusedGlobalSymbols

/**
 * 结算条相关
 */
class SettlementController {
  static div = null

  /**
   * 设置Settlement的dom
   * @param {HTMLDivElement} div
   */
  static SetSettlement(div) {
    this.div = div
  }

  /**
   * 显示结算条
   * @param {Number} winner 胜利方，0平局、1先方、2后方
   */
  static ShowEndDiv (winner) {
    const div = this.div
    if (div === null) {
      console.log('未设置结算条的Dom')
      return
    }

    div.style.transform = 'translate(0, -50%) scale(1)'
    div.style.opacity   = '1'

    const root = getComputedStyle(document.documentElement)

    switch (winner) {
      case 0:
        div.style.color = root.getPropertyValue('--button_color')
        div.innerHTML = '平局'
        break
      case 1:
        div.style.color = root.getPropertyValue('--main_color_1')
        div.innerHTML = '红方胜利'
        break
      case 2:
        div.style.color = root.getPropertyValue('--main_color_2')
        div.innerHTML = '蓝方胜利'
        break
    }
  }

  /**
   * 隐藏结算条
   */
  static HiddenEndDiv () {
    const div = this.div
    if (div === null) {
      console.log('未设置结算条的Dom')
      return
    }

    div.style.transform = 'translate(0, -50%) scale(1, .001)'
    div.style.opacity   = '0'
    div.innerHTML = ''
  }
}
