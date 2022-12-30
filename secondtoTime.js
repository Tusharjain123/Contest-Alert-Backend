const secondsToTime = (e) => {
    const d = Math.floor(e / (24 * 3600));
    if (d > 0) {
      const h = Math.floor((e % (24 * 3600)) / 3600).toString().padStart(2, "0"),
        m = Math.floor((e % 3600) / 60).toString().padStart(2, "0")
      return d + " days " + h + " hr " + m + " min ";
    }
    else {
      const h = Math.floor(e / 3600).toString().padStart(2, "0"),
        m = Math.floor((e % 3600) / 60).toString().padStart(2, "0")
      return h + " hr " + m + " min ";
    }
  }

module.exports = secondsToTime
