class Utils {
  // Credit: https://stackoverflow.com/a/24559613
  static scrollToTop (duration) {
    // cancel if already on top
    if (document.scrollingElement.scrollTop === 0) {
      return
    }

    const cosParameter = document.scrollingElement.scrollTop / 2
    let scrollCount = 0
    let oldTimestamp = null

    function step (newTimestamp) {
      if (oldTimestamp !== null) {
        // if duration is 0 scrollCount will be Infinity
        scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration
        if (scrollCount >= Math.PI) {
          document.scrollingElement.scrollTop = 0
          return
        }
        document.scrollingElement.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount)
      }
      oldTimestamp = newTimestamp
      window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step)
  }

  static loadDefaultConfig (currValues = {}) {
    const vals = localStorage.getItem('phoenix-experiment-microsite-settings')
    let obj = currValues || {}
    try {
      obj = JSON.parse(vals)
    } catch (e) {}
    return obj
  }

  static saveDefaultConfig (currValues = {}) {
    localStorage.setItem('phoenix-experiment-microsite-settings', JSON.stringify(currValues))
  }
}

export default Utils
