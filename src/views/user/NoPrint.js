/* eslint-disable prettier/prettier */
/*
NoPrint.js V1.0
Created by PDFAntiCopy.com
*/
/*
NoPrint.js V1.0
Created by PDFAntiCopy.com
*/

// file NoPrint.js
class NoPrint {
  constructor() {
    this.noCopy = true
    this.noPrint = false
    this.autoBlur = false
    this.noScreenshot = true

    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.blurElement = null
  }

  enable() {
    if (this.noCopy) {
      document.body.oncopy = function (event) {
        return false
      }
      document.body.oncontextmenu = function (event) {
        return false
      }
      document.body.onselectstart = document.body.ondrag = function (event) {
        return false
      }
    }

    document.addEventListener('keyup', this.handleKeyUp)

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'p') {
        if (this.noPrint) {
          e.cancelBubble = true
          e.preventDefault()
          e.stopImmediatePropagation()
        }
      }
    })
  }

  disableRightClick() {
    document.body.oncontextmenu = function (event) {
      return true
    }
  }

  disableScreenshot() {
    document.removeEventListener('keyup', this.handleKeyUp)
    if (this.blurElement) {
      this.blurElement.style.filter = 'none'
      this.blurElement = null
    }
  }

  handleKeyUp(e) {
    if (e.key === 'PrintScreen') {
      if (this.noScreenshot) {
        this.blurElement = document.documentElement
        this.blurElement.style.filter = 'blur(10px)'
        setTimeout(() => {
          this.blurElement.style.filter = 'none'
          this.blurElement = null
        }, 1000)
      }
    }
  }
}

export default NoPrint
