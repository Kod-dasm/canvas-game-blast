export default class Star {
    activeStars = []
    constructor(columnNumber,rowNumber, template) {
      this.template = template
      // this.color = ['blue', 'green', 'purple', 'red', 'yellow'][Math.floor(Math.random() * 5)]
      this.active = false
      this.hover = false
      this.x = columnNumber
      this.y = rowNumber
      this.currentPlace = 10 // y
    }  
  }