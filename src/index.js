import './styles/main.css'
import '@babel/polyfill'

const game = {
  sizeStar: 48,
  countStarX: 6,
  countStarY: 6,
  speed: 96,
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
  activeStars = []
  constructor(columnNumber,rowNumber) {
    this.color = ['blue', 'green', 'purple', 'red', 'yellow'][Math.floor(Math.random() * 5)]
    this.active = false
    this.hover = false
    this.x = columnNumber
    this.y = rowNumber
    this.currentPlace = 10 // y
  }
  burnStar() {
    this.activateStars()
    game.field = game.field.map(itemX => itemX.filter(itemY => !itemY.active ? true : false))
    this.recoverField()
  }
  activateStars() {
    for (let i = 0; i < this.activeStars.length; i++) {
        game.field[this.activeStars[i].x][this.activeStars[i].y].active = true
    }
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
  
  game.canvas.addEventListener("mousemove", moveOnStar, false)
  game.canvas.addEventListener("click", clickOnStar, false)

  function moveOnStar(e) {
    const x = e.offsetX
    const y = e.offsetY
    checkStar(x, y, hoverStars)
  }

  function hoverStars(item, coordX, coordY) { 
    // this.fieldDel = []
    // !this.activeBomb ? this.searchInWidth(item.color, coordX, coordY) : this.searchDetonateZone(this.radiusBomb, coordX, coordY)
    // searchInWidth(item.color, coordX, coordY)
    if (item.activeStars.length == 0){
      searchInWidth(item, coordX, coordY)
      updateField(resetHover)
    }
  }
  function saveTheStarValue(item, coordX, coordY) {
    game.field[coordX][coordY].hover = true
    item.activeStars.push({ x: coordX, y: coordY })
  }
  function isColor(color, coordX, coordY) {
      if (typeof color == "string" && color == game.field[coordX][coordY].color) return true
      else if (typeof color == "number") return true
      return false
  }
  function checkUpCell(item, coordX, coordY, func) {
      // if (coordY < this.sizeFieldY && isColor(item.color, coordX, coordY) && !this.field[coordX][coordY].hover) {
      if (coordY < game.countStarY && isColor(item.color, coordX, coordY) && !game.field[coordX][coordY].hover) {
          // if (this.activeBomb && coordY == this.fieldDel[0].y) {
          //     return
          // }
          func(item, coordX, coordY)
      }
  }
  function checkLeftCell(item, coordX, coordY, func) {
      if (coordX >= 0 && isColor(item.color, coordX, coordY) && !game.field[coordX][coordY].hover) {
          // if (this.activeBomb && coordX == this.fieldDel[0].x) {
          //     return
          // }
          func(item, coordX, coordY)
      }
  }
  function checkDownCell(item, coordX, coordY, func) {
      if (coordY >= 0 && isColor(item.color, coordX, coordY) && !game.field[coordX][coordY].hover) {
          // if (this.activeBomb && coordY == this.fieldDel[0].y) {
          //     return
          // }
          func(item, coordX, coordY)
      }
  }
  function checkRightCell(item, coordX, coordY, func) {
      if (coordX < game.countStarX && isColor(item.color, coordX, coordY) && !game.field[coordX][coordY].hover) {
          // if (this.activeBomb && coordX == this.fieldDel[0].x) {
          //     return
          // }
          func(item, coordX, coordY)
      }
  }
  function searchProcess(item, coordX, coordY, func) {
      checkUpCell(item, coordX, coordY + 1, func)
      checkLeftCell(item, coordX - 1, coordY, func)
      checkDownCell(item, coordX, coordY - 1, func)
      checkRightCell(item, coordX + 1, coordY, func)
  }
  function searchInWidth(item, coordX, coordY) {
    saveTheStarValue(item, coordX, coordY)
    searchProcess(item, coordX, coordY, searchInWidth)
  }
  function searchDetonateZone(radius, coordX, coordY) {
      this.saveTheStarValue(coordX, coordY)
      if (radius < 1) {
          return
      }
      this.searchProcess(radius - 1, coordX, coordY, this.searchDetonateZone)
  }
  function deactivateTheZone(){
      game.field = game.field.map(itemX => itemX.map(itemY => {
          if (itemY.hover) {
              itemY.hover = false
          }
          return itemY
      }))
  }


  function clickOnStar(e) {
    const x = e.offsetX
    const y = e.offsetY
    checkStar(x, y, remove)
  }
  function checkStar(x, y, func) {
    if (x > 10 && x < game.sizeFieldX && y > 10 && y < game.sizeFieldY) {
      checkByColumn(x, y, func)
    }
  }
  function checkByColumn(x, y, func) {
    for (let columnNumber = 0; columnNumber < game.countStarX; columnNumber++) {
      checkByRow(x, y, columnNumber, func)
    }
  }
  function checkByRow(x, y, columnNumber, func) {
    for (let rowNumber = 0; rowNumber < game.countStarY; rowNumber++) {
      const star = game.field[columnNumber][rowNumber] 
      if(x > star.x && x < (star.x + game.sizeStar) && y > star.y && y < (star.y + game.sizeStar)) {
        func(star, columnNumber, rowNumber)
      }
    }
  }
  function remove(star) {
    star.burnStar()
    updateField(resetActiveStars)
    animationOfShootingStars()
  }
  
  function updateField(func) {
    game.field = game.field.map(itemX => itemX.map(itemY => {
      return func(itemY)
    }))
  }
  function resetActiveStars(itemY) {
    itemY.activeStars = []
    return itemY
  }
  function resetHover(itemY) {
    itemY.hover = false
    return itemY
  }
