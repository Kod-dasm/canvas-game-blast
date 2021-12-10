export default class Star {
  activeStars = [];
  constructor(columnNumber, rowNumber, template) {
    this.template = template;
    this.active = false;
    this.hover = false;
    this.x = columnNumber;
    this.y = rowNumber;
    this.currentPlace = 10; // y
  }
}
