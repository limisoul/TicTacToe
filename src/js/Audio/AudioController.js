// noinspection JSUnusedGlobalSymbols

class AudioController {
  static audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  /**
   * 使浏览器允许播放声音
   */
  static EnableAudio() {
    // 创建空白的音频缓冲区
    const buffer = this.audioCtx.createBuffer(1, 1, 22050)
    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(this.audioCtx.destination)

    // 播放空白的音频缓冲区
    if (source.start) {
      source.start(0)
    } else if (source.play) {
      source.play(0)
    }
  }

  /**
   * 播放音频文件
   * @param {string} file
   */
  static PlaySound(file) {
    if (!DataBase.isAudioPlay) return

    const audio = new Audio(file)

    audio.play().then(_ => {})
  }

  /**
   * 初始化背景音乐
   */
  static InitBackGround() {
    this.bgAudio = new Audio(MusicFiles.background)
    this.bgAudio.loop = true
  }

  static TryPlayBackGround() {
    if (DataBase.isAudioPlay) {
      this.bgAudio.play().then(_ => {})
    } else {
      this.bgAudio.pause()
    }
  }
}

const MusicFiles = {
  background: '/src/resources/Audio/BGGuzheng.mp3',
  book_page:  '/src/resources/Audio/BookPage.wav',
  blacksmith: '/src/resources/Audio/Blacksmith.wav',
  coin:       '/src/resources/Audio/Coin.wav',
  ui_click:   '/src/resources/Audio/UIClick.wav',
}
