// noinspection JSUnusedGlobalSymbols

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
    return function (event) {
      if (!DataBase.isAllowClick) {
        return
      }
      DataBase.isAllowClick = false

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
    if (DataBase.isGameEnd) {
      DataBase.isAllowClick = true
      return
    }

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
        DataBase.score[DataBase.currentOrder - 1] = (DataBase.score[DataBase.currentOrder - 1] + 1) % 100
        DataBase.gameBoard = Array(3).fill(undefined, undefined, undefined).map(() => Array(3).fill(0))

        ScoreBoardController.LoadScore()
      } else {
        // 结束回合并切换
        DataBase.SwitchRounds()
        ScoreBoardController.ToggleIconHighLight()

        if (!DataBase.GameBoardHasEmpty()) {
          /****************** 平局 ******************/
          SettlementController.ShowEndDiv(0)

          DataBase.isGameEnd = true
          DataBase.gameBoard = Array(3).fill(undefined, undefined, undefined).map(() => Array(3).fill(0))
        }
      }
      /****************** 写内存 ******************/
      Memory.MemSet()
    }
    DataBase.isAllowClick = true
  }

  /**
   * 渲染棋子
   * @param {number} curr
   * @return {HTMLDivElement}
   */
  static CreateChessDiv(curr = DataBase.currentOrder - 1) {
    const div = document.createElement('div')
    if (curr) {
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

  /**
   * 创建棋盘线
   * @param {HTMLDivElement} div
   */
  static CreateGameBoardLine(div) {
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

  /**
   * 从存储中加载
   * @param {HTMLDivElement} gameBoard
   */
  static InitBoard(gameBoard) {
    const chessPlace = gameBoard.getElementsByClassName('chessPlaceholder')

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (DataBase.PlaceIsEmpty(new Vector2(j, i))) {
          continue
        }
        let div = this.CreateChessDiv(DataBase.gameBoard[i][j] - 1)

        chessPlace[i * 3 + j].appendChild(div)
        setTimeout(() => {
          GuiAnimator.ShowElement(div)
        }, 20)
      }
    }
  }
}
