import { Star } from ".";
const STAR_COLORS = ["blue", "green", "purple", "red", "yellow"];

export default class Game {
  constructor(
    _sizeStar = 48,
    _countStarX = 10,
    _countStarY = 10,
    _speed = 192,
    _radiusBomb = 3,
    _minCountStarsBurn = 2,
    _moves = 100,
    _bonuse = 0
  ) {
    this.sizeStar = _sizeStar;
    this.countStarX = _countStarX;
    this.countStarY = _countStarY;
    this.speed = _speed;
    this.radiusBomb = _radiusBomb;
    this.minCountStarsBurn = _minCountStarsBurn;
    this.bonuse = _bonuse;
    this.moves = _moves;
    this.field = [];
    this.activeBomb = false;
    const background = new Image();
    background.src = "/images/field.png";
    this.img = {
      fon: { img: background, loaded: false },
    };
    const blueStar = new Image();
    blueStar.src = "/images/blue.png";
    const greenStar = new Image();
    greenStar.src = "/images/green.png";
    const purpleStar = new Image();
    purpleStar.src = "/images/purple.png";
    const redStar = new Image();
    redStar.src = "/images/red.png";
    const yellowStar = new Image();
    yellowStar.src = "/images/yellow.png";
    this.stars = {
      blue: { color: "blue", img: blueStar, loaded: false },
      green: { color: "green", img: greenStar, loaded: false },
      purple: { color: "purple", img: purpleStar, loaded: false },
      red: { color: "red", img: redStar, loaded: false },
      yellow: { color: "yellow", img: yellowStar, loaded: false },
    };
  }
  draw(score) {
    this.canvas = document.getElementById("gameField");
    this.ctx = this.canvas.getContext("2d");
    this.sizeFieldX = this.sizeStar * this.countStarX + 20;
    this.sizeFieldY = this.sizeStar * this.countStarY + 20;
    this.canvas.setAttribute("width", this.sizeFieldX);
    this.canvas.setAttribute("height", this.sizeFieldY);
    this.createdField(score);
    this.animationOfShootingStars();
  }
  createdField(score) {
    score.updateScore();
    for (let columnNumber = 0; columnNumber < this.countStarX; columnNumber++) {
      this.field.push(this.addCell(columnNumber));
    }
  }
  addCell(columnNumber) {
    let cells = [];
    for (let rowNumber = 0; rowNumber < this.countStarY; rowNumber++) {
      cells.push(
        this.createStar(
          10 + columnNumber * this.sizeStar,
          10 + (this.countStarY - (rowNumber + 1)) * this.sizeStar
        )
      );
    }
    return cells;
  }
  createStar(columnNumber, rowNumber) {
    const starTemplate =
      this.stars[STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]];
    return new Star(columnNumber, rowNumber, starTemplate);
  }
  burnTheStar(star) {
    this.activateStars(star);
    if (star.activeStars.length >= this.minCountStarsBurn) {
      this.field = this.field.map((itemX) =>
        itemX.filter((itemY) => (!itemY.active ? true : false))
      );
      this.recoverField();
    }
  }
  activateStars(star) {
    for (let i = 0; i < star.activeStars.length; i++) {
      this.field[star.activeStars[i].x][star.activeStars[i].y].active = true;
    }
  }
  recoverField() {
    for (let columnNumber = 0; columnNumber < this.countStarX; columnNumber++) {
      if (this.field[columnNumber].length != this.countStarX) {
        for (let rowNumber = 0; rowNumber < this.countStarY; rowNumber++) {
          if (this.field[columnNumber].length >= rowNumber + 1) {
            this.updateCoordStar(columnNumber, rowNumber);
          } else {
            this.addStar(columnNumber, rowNumber);
          }
        }
      }
    }
  }
  addStar(columnNumber, rowNumber) {
    this.field[columnNumber].push(
      this.createStar(
        10 + columnNumber * this.sizeStar,
        10 + (this.countStarY - (rowNumber + 1)) * this.sizeStar
      )
    );
  }
  updateCoordStar(columnNumber, rowNumber) {
    this.field[columnNumber][rowNumber].x = 10 + columnNumber * this.sizeStar;
    this.field[columnNumber][rowNumber].y =
      10 + (this.countStarY - (rowNumber + 1)) * this.sizeStar;
  }
  animationOfShootingStars() {
    const game = this;
    for (let rowNumber = 0; rowNumber < game.countStarY; rowNumber++) {
      let step = 0;
      (function animation() {
        if (game.field.length != 0) {
          game.moveStars(rowNumber + 1);
          game.drawField(rowNumber, step + 1);
          step++;
          if (step < game.speed) {
            window.requestAnimationFrame(animation);
          }
        }
      })(rowNumber);
    }
  }
  moveStars(currentRowNumber) {
    for (let rowNumber = 0; rowNumber < currentRowNumber; rowNumber++) {
      for (
        let columnNumber = 0;
        columnNumber < this.countStarX;
        columnNumber++
      ) {
        if (
          this.field[columnNumber][rowNumber].currentPlace <
          this.field[columnNumber][rowNumber].y
        ) {
          this.field[columnNumber][rowNumber].currentPlace +=
            this.sizeStar / this.speed;
        }
      }
    }
  }
  drawField(currentRowNumber = this.countStarY - 1) {
    this.drawBackground();
    for (let columnNumber = 0; columnNumber < this.countStarX; columnNumber++) {
      for (let rowNumber = currentRowNumber; rowNumber >= 0; rowNumber--) {
        this.drawStar(this.field[columnNumber][rowNumber]);
      }
    }
  }
  drawBackground() {
    const background = this.img.fon;
    if (!background.loaded) {
      background.img.addEventListener(
        "load",
        this.drawImageLoaded(
          background,
          0,
          0,
          this.sizeFieldX,
          this.sizeFieldY
        ),
        false
      );
    } else {
      this.ctx.drawImage(
        this.img.fon.img,
        0,
        0,
        this.sizeFieldX,
        this.sizeFieldY
      );
    }
  }
  drawImageLoaded(item, x, y, sizeX, sizeY) {
    item.loaded = true;
    this.ctx.drawImage(item.img, x, y, sizeX, sizeY);
  }
  drawStar(star, sizeStar = this.sizeStar) {
    if (!star.template.loaded) {
      star.template.img.addEventListener(
        "load",
        this.drawImageLoaded(
          star.template,
          star.x,
          star.currentPlace,
          sizeStar,
          sizeStar
        ),
        false
      );
    } else {
      this.ctx.drawImage(
        star.template.img,
        star.x,
        star.currentPlace,
        sizeStar,
        sizeStar
      );
    }
  }
}
