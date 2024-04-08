// noinspection JSUnusedGlobalSymbols

/**
 * 分数控制相关
 */
class ScoreBoardController {
  static scoreboard = null

  /**
   * 加载分数
   * @param {HTMLDivElement} scoreboard 第一次需要传参
   */
  static LoadScore(scoreboard = this.scoreboard) {
    this.scoreboard = scoreboard
    const icon = scoreboard.getElementsByClassName('icon')
    icon[0].innerHTML = `${Unicode.chess_cross}`
    icon[1].innerHTML = `${Unicode.chess_nought}`

    /**
     * 设置分数
     * @param {Number} index 先后手 1、2
     */
    const setScore = function (index) {
      const SCORE = scoreboard.getElementsByClassName('score')[index - 1]

      const NUM_LEN = SCORE.children.length
      let   score   = DataBase.score[index - 1]

      if (NUM_LEN === 0) { // 初始化生成
        while(score >= 1) {
          const NUM = document.createElement('div')
          NUM.textContent = score % 10 + ''
          NUM.setAttribute('class', 'hidden')

          SCORE.appendChild(NUM)
          score = Math.floor(score / 10)
          setTimeout(() => {
            GuiAnimator.ShowElement(NUM)
          }, 20)
        }
      } else { // 更新
        let placePoint = 0

        while(score >= 1) {
          if (placePoint < NUM_LEN) {
            // 分数不变不更新
            if (SCORE.children[placePoint].textContent === score % 10 + '') {
              placePoint += 1
              score = Math.floor(score / 10)

              continue
            }

            GuiAnimator.HiddenElement(SCORE.children[placePoint]);

            // 显示分数时闭包保证score是当前分数
            (function (pp, num) {
              setTimeout(() => {
                GuiAnimator.ShowElement(SCORE.children[pp])

                SCORE.children[pp].textContent = num + ''
              }, 200)
            })(placePoint, score % 10)

            placePoint += 1
          } else {
            const NUM = document.createElement('div')
            NUM.textContent = score % 10 + ''
            NUM.style.transition = '.2s'
            NUM.setAttribute('class', 'hidden')

            SCORE.appendChild(NUM)
            setTimeout(() => {
              GuiAnimator.ShowElement(NUM)
            }, 20)
          }
          score = Math.floor(score / 10)
        }
      }
    }
    setScore(1)
    setScore(2)
  }

  /**
   * 切换回合强调
   */
  static ToggleIconHighLight() {
    const ICON = this.scoreboard.getElementsByClassName('icon')

    ICON[0].style.transform = 1 === DataBase.currentOrder ? 'scale(1.2)' : 'scale(1)'
    ICON[1].style.transform = 2 === DataBase.currentOrder ? 'scale(1.2)' : 'scale(1)'
  }
}
