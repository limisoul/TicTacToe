// noinspection JSUnusedGlobalSymbols
// 依赖项：dataBase.js, icon.js

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
 * 棋盘控制相关
 */
class GameBoardController {
  /**
   * 监听标准化点击位置
   * @param {HTMLDivElement} gameBoard
   */
  static SetClickPositionEvent (gameBoard) {
    gameBoard.addEventListener('click', GameBoardController.clickEvent(gameBoard))
  }

  /**
   * @param {HTMLDivElement} gameBoard
   */
  static clickEvent(gameBoard) {
    if (!DataBase.isAllowClick) return;
    DataBase.isAllowClick = false

    return function (event) {
      const click = new Vector2(event.clientX, event.clientY)

      const divRect = gameBoard.getBoundingClientRect()

      const relative = Vector2.Sub(click, new Vector2(divRect.left, divRect.top))

      let toNormal = Vector2.Mul(Vector2.Div(relative, divRect.width), 3)
      toNormal = new Vector2(Math.floor(toNormal.x), Math.floor(toNormal.y))

      GameBoardController.SetChessWith(toNormal, gameBoard)
    }
  }

  /**
   * 在目标点创建棋子
   * @param {Vector2} position
   * @param {HTMLDivElement} gameBoard
   */
  static SetChessWith(position, gameBoard) {
    if (DataBase.isGameEnd) return

    const chessPlace = gameBoard.getElementsByClassName('chessPlaceholder')

    // 判断是否可以创建
    if (DataBase.PlaceIsEmpty(position)) {
      const div = this.CreateChessDiv()

      // 渲染到GUI
      chessPlace[position.x + position.y * 3].appendChild(div)
      setTimeout(() => {
        GuiAnimator.ShowElement(div)
      }, 20)

      // 数据库操作
      DataBase.SetChess(position)

      // 添加后检查是否胜利
      if (DataBase.currIsWin()) {
        /****************** 胜利 ******************/
        SettlementController.ShowEndDiv(DataBase.currentOrder)

        DataBase.isGameEnd = true
        DataBase.score[DataBase.currentOrder - 1] += 1

        ScoreBoardController.LoadScore()
        return
      }

      // 结束回合并切换
      DataBase.SwitchRounds()
      ScoreBoardController.ToggleIconHighLight()

      if (!DataBase.GameBoardHasEmpty()) {
        /****************** 平局 ******************/
        SettlementController.ShowEndDiv(0)

        DataBase.isGameEnd = true
      }

      DataBase.isAllowClick = true
    }
  }

  /**
   * 渲染棋子
   * @return {HTMLDivElement}
   */
  static CreateChessDiv() {
    const div = document.createElement('div')
    if (DataBase.currentOrder - 1) {
      div.innerHTML   = `${Unicode.chess_nought}`
      div.style.color = getComputedStyle(document.documentElement).getPropertyValue('--main_color_2')
    } else {
      div.innerHTML   = `${Unicode.chess_cross}`
      div.style.color = getComputedStyle(document.documentElement).getPropertyValue('--main_color_1')
    }
    div.style.fontSize   = getComputedStyle(document.documentElement).getPropertyValue('--chess_size')
    div.style.width      = '126px'
    div.style.textAlign  = 'center'
    div.style.cursor     = 'pointer'
    div.setAttribute('class', 'hidden')

    return div
  }
}


/**
 * 分数控制相关
 */
class ScoreBoardController {
  static scoreboard = null

  /**
   * 加载分数
   * @param {HTMLDivElement} scoreboard
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
