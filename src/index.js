import './styles/main.css'
import '@babel/polyfill'

const game = {
  sizeStar: 48,
  countStarX: 6,
  countStarY: 6,
  speed: 192,
  field: [],
  canvas: null,
  ctx: null,
  background: new Image(),
  blueStar: new Image(),
  greenStar: new Image(),
  purpleStar: new Image(),
  redStar: new Image(),
  yellowStar: new Image(),
}

class Star {
  constructor(columnNumber,rowNumber) {
    this.color = ['blue', 'green', 'purple', 'red', 'yellow'][Math.floor(Math.random() * 5)]
    this.active = false
    this.x = columnNumber
    this.y = rowNumber
    this.currentPlace = 10 // y
  }
  burnStar() {
    this.active = true
    game.field = game.field.map(itemX => itemX.filter(itemY => !itemY.active ? true : false))
    game.ctx.fillRect(this.x, this.y, game.sizeStar, game.sizeStar)
    this.recoverField()
  }
  recoverField() {
    for (let columnNumber = 0; columnNumber < game.countStarX; columnNumber++) {
      if (game.field[columnNumber].length != game.countStarX){
        for (let rowNumber = 0; rowNumber < game.countStarY; rowNumber++) {
          if (game.field[columnNumber].length >= rowNumber + 1) {
            this.updateCoordStar(columnNumber, rowNumber)
          }
          else {
            this.addStar(columnNumber, rowNumber)
          }
        }   
      }
    }
  }
  addStar(columnNumber, rowNumber) {
    game.field[columnNumber].push(new Star(10 + columnNumber * game.sizeStar, 10 + (game.countStarY - (rowNumber + 1)) * game.sizeStar))
  }
  updateCoordStar(columnNumber, rowNumber) {
    game.field[columnNumber][rowNumber].x = 10 + columnNumber * game.sizeStar
    game.field[columnNumber][rowNumber].y = 10 + (game.countStarY - (rowNumber + 1)) * game.sizeStar
  }
}

function createdField() {
  for (let columnNumber = 0; columnNumber < game.countStarX; columnNumber++) {
    game.field.push(addCell(columnNumber))
  }
}
function addCell(columnNumber) {
  let cells = []
  for (let rowNumber = 0; rowNumber < game.countStarY; rowNumber++) {
    cells.push(new Star(10 + columnNumber * game.sizeStar, 10 + (game.countStarY - (rowNumber + 1)) * game.sizeStar))
  }
  return cells
}
function animationOfShootingStars() {
  for (let rowNumber = 0; rowNumber < game.countStarY; rowNumber++) {
  let step = 0;
  (function animation(){
      moveStars(rowNumber+1)
      drawField(rowNumber, step + 1)
      step++
      if (step < game.speed) {
        window.requestAnimationFrame(animation)
      }
  })(rowNumber)
  }
}
function moveStars(currentRowNumber) {
  for (let rowNumber = 0; rowNumber < currentRowNumber; rowNumber++) {
    for (let columnNumber = 0; columnNumber < game.countStarX; columnNumber++) {
      if (game.field[columnNumber][rowNumber].currentPlace < game.field[columnNumber][rowNumber].y) {
        game.field[columnNumber][rowNumber].currentPlace += game.sizeStar / game.speed
      }
    }
  }
}
function drawField(currentRowNumber, step) {
  drawBackground()
  for (let columnNumber = 0; columnNumber < game.countStarX; columnNumber++) {
    for (let rowNumber = currentRowNumber; rowNumber >= 0; rowNumber--) {
      drawStar(columnNumber, rowNumber, step)
    }
  }
}
function drawBackground() {
  if (!game.background.loaded){
    game.background.addEventListener("load", function() {
      game.background.loaded = true
      game.ctx.drawImage(game.background, 0, 0, game.sizeFieldX, game.sizeFieldY);
    }, false);
  }
  else {
    game.ctx.drawImage(game.background, 0, 0, game.sizeFieldX, game.sizeFieldY);
  }
}
function drawStar(columnNumber, rowNumber, step) {
  const star = game.field[columnNumber][rowNumber]
  const color = colorStar(star.color)
  // const stepAnimation = step * game.sizeStar / game.speed
  if (!color.loaded){
    color.addEventListener("load", function() {
      color.loaded = true
        
        // game.ctx.drawImage(color, star.x, star.currentPlace, game.sizeStar, stepAnimation)
      game.ctx.drawImage(color, star.x, star.currentPlace, game.sizeStar, game.sizeStar)
    }, false);
  }
  else {
    game.ctx.drawImage(color, star.x, star.currentPlace, game.sizeStar, game.sizeStar)
  }
}

function colorStar(color) {
  if (color == 'blue') {
    return game.blueStar
  } 
  else if (color == 'green') {
    return game.greenStar
  } 
  else if (color == 'purple') {
    return game.purpleStar
  } 
  else if (color == 'red') {
    return game.redStar
  } 
  return game.yellowStar
}

function initializingImages() {
  game.background.src ="/images/field.png"
  game.blueStar.src = "/images/blue.png"
  game.greenStar.src = "/images/green.png"
  game.purpleStar.src = "/images/purple.png"
  game.redStar.src = "/images/red.png"
  game.yellowStar.src = "/images/yellow.png"
}

function draw() {
  game.canvas = document.getElementById('gameField')
  game.ctx = game.canvas.getContext('2d')
  initializingImages()  
  game.sizeFieldX = game.sizeStar * game.countStarX + 20
  game.sizeFieldY = game.sizeStar * game.countStarY + 20
  game.canvas.setAttribute('width', game.sizeFieldX)
  game.canvas.setAttribute('height', game.sizeFieldY)
  createdField()
  animationOfShootingStars()
  console.log('field = ', game.field)
  }
  draw()
  
  // function onMouseMove(e){ 
  //   console.log("x = ", e.offsetX, "y = ", e.offsetY, "event = ", e)
  // }
  
  game.canvas.addEventListener("click", clickOnStar, false)

  function clickOnStar(e) {
    const x = e.offsetX
    const y = e.offsetY
    if (x > 10 && x < game.sizeFieldX && y > 10 && y < game.sizeFieldY) {
      removeStarOnColumn(x, y)
    }
  }
  function removeStarOnColumn(x, y) {
    for (let columnNumber = 0; columnNumber < game.countStarX; columnNumber++) {
      removeStarOnRow(x, y, columnNumber)
    }
  }
  function removeStarOnRow(x, y, columnNumber) {
    for (let rowNumber = 0; rowNumber < game.countStarY; rowNumber++) {
      const star = game.field[columnNumber][rowNumber] 
      if(x > star.x && x < (star.x + game.sizeStar) && y > star.y && y < (star.y + game.sizeStar)) {
        star.burnStar()
        animationOfShootingStars()
      }
    }
  }
