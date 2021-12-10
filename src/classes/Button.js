export default class Button {
  constructor(id, click) {
    this.elem = document.getElementById(id);
    this.click = click;
  }
}
