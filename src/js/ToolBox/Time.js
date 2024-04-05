// noinspection JSUnusedGlobalSymbols

class TTime {
  constructor() {
    this.time = performance.now()
    this.fixedTime = 20
    this.deltaTime = this.time

    this.UpdateDeltaTime = this.UpdateDeltaTime.bind(this)
    this.UpdateDeltaTime()
  }

  /**
   * 获取更新毫秒
   */
  UpdateDeltaTime() {
    this.deltaTime = performance.now() - this.time
    this.time   = performance.now()
    requestAnimationFrame(this.UpdateDeltaTime)
  }

  /**
   * 生成ID
   * @returns {string}
   */
  GenerateUniqueId() {
    const timestamp = Date.now().toString(16)
    const random = Math.random().toString(16).substring(2)
    return timestamp + random
  }
}
const Time = new TTime()
