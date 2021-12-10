import "@babel/polyfill";
import "./styles/main.css";
import { Game, Button, Score } from "./classes";

let game = new Game();

const score = new Score(1000);

const bonuseBomb = new Button("bomb", function () {
  if (game.bonuse >= 5) {
    game.activeBomb = true;
    updateField(resetActiveStars);
    game.bonuse -= 5;
    computedData("bonuse", game.bonuse);
  }
});
const bonuseRepeat = new Button("repeat", function () {
  if (game.bonuse >= 3) {
    game.field = [];
    game.createdField(score);
    game.animationOfShootingStars();
    game.bonuse -= 3;
    computedData("bonuse", game.bonuse);
  }
});
const newGame = new Button("newGame", function () {
  console.log(game);
  removeEvent();
  const score = new Score(1000);
  game = new Game();
  computedData("moves", game.moves);
  computedData("bonuse", game.bonuse);
  game.draw(score);
  addEvent();
});
game.draw(score);
addEvent();
newGame.elem.addEventListener("click", newGame.click, false);
computedData("moves", game.moves);
computedData("bonuse", game.bonuse);

function computedData(id, count) {
  const elem = document.getElementById(id);
  elem.innerHTML = count;
}
function addEvent() {
  game.canvas.addEventListener("mousemove", moveOnStar, false);
  game.canvas.addEventListener("click", clickOnStar, false);
  bonuseBomb.elem.addEventListener("click", bonuseBomb.click, false);
  bonuseRepeat.elem.addEventListener("click", bonuseRepeat.click, false);
}
function removeEvent() {
  game.canvas.removeEventListener("mousemove", moveOnStar, false);
  game.canvas.removeEventListener("click", clickOnStar, false);
  bonuseBomb.elem.removeEventListener("click", bonuseBomb.click, false);
  bonuseRepeat.elem.removeEventListener("click", bonuseRepeat.click, false);
}
function moveOnStar(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  game.drawField();
  updateField(resetHover);
  checkStar(x, y, hoverStars);
}
function hoverStars(item, coordX, coordY) {
  if (item.activeStars.length == 0) {
    !game.activeBomb
      ? searchInWidth(item, coordX, coordY)
      : searchDetonateZone(item, coordX, coordY, game.radiusBomb);
    animationHover(item);
    return;
  }
  animationHover(item);
}
function animationHover(item) {
  for (let i = 0; i < item.activeStars.length; i++) {
    game.drawStar(
      item.activeStars[i].x,
      item.activeStars[i].y,
      game.sizeStar + 4
    );
  }
}
function saveTheStarValue(item, coordX, coordY) {
  game.field[coordX][coordY].hover = true;
  if (
    item.activeStars.length != 0 &&
    coordX == item.activeStars[0].x + 1 &&
    coordY == item.activeStars[0].y
  ) {
    item.activeStars.push({ x: coordX, y: coordY, mes: "hello" });
    return;
  }
  item.activeStars.push({ x: coordX, y: coordY });
}
function isColor(color, coordX, coordY) {
  if (game.activeBomb) return true;
  else if (
    typeof color == "string" &&
    color == game.field[coordX][coordY].template.color
  )
    return true;
  return false;
}
function checkUpCell(item, coordX, coordY, func, radius) {
  if (
    coordY < game.countStarY &&
    isColor(item.template.color, coordX, coordY) &&
    !game.field[coordX][coordY].hover
  ) {
    if (game.activeBomb && coordY == item.activeStars[0].y) {
      return;
    }
    func(item, coordX, coordY, radius);
  }
}
function checkLeftCell(item, coordX, coordY, func, radius) {
  if (
    coordX >= 0 &&
    isColor(item.template.color, coordX, coordY) &&
    !game.field[coordX][coordY].hover
  ) {
    if (game.activeBomb && coordX == item.activeStars[0].x) {
      return;
    }
    func(item, coordX, coordY, radius);
  }
}
function checkDownCell(item, coordX, coordY, func, radius) {
  if (
    coordY >= 0 &&
    isColor(item.template.color, coordX, coordY) &&
    !game.field[coordX][coordY].hover
  ) {
    if (game.activeBomb && coordY == item.activeStars[0].y) {
      return;
    }
    func(item, coordX, coordY, radius);
  }
}
function checkRightCell(item, coordX, coordY, func, radius) {
  if (
    coordX < game.countStarX &&
    isColor(item.template.color, coordX, coordY) &&
    !game.field[coordX][coordY].hover
  ) {
    if (game.activeBomb && coordX == item.activeStars[0].x) {
      return;
    }
    func(item, coordX, coordY, radius);
  }
}
function searchProcess(item, coordX, coordY, func, radius) {
  checkUpCell(item, coordX, coordY + 1, func, radius);
  checkLeftCell(item, coordX - 1, coordY, func, radius);
  checkDownCell(item, coordX, coordY - 1, func, radius);
  checkRightCell(item, coordX + 1, coordY, func, radius);
}
function searchInWidth(item, coordX, coordY) {
  saveTheStarValue(item, coordX, coordY);
  searchProcess(item, coordX, coordY, searchInWidth);
}
function searchDetonateZone(item, coordX, coordY, radius) {
  saveTheStarValue(item, coordX, coordY);
  if (radius < 1) {
    return;
  }
  searchProcess(item, coordX, coordY, searchDetonateZone, radius - 1);
}
function clickOnStar(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  checkStar(x, y, remove);
}
function checkStar(x, y, func) {
  const coordX = Math.floor((x - 10) / game.sizeStar);
  const coordY = game.countStarY - 1 - Math.floor((y - 10) / game.sizeStar);
  if (
    !(coordX < 0 || coordX > game.countStarX - 1) &&
    !(coordY < 0 || coordY > game.countStarY - 1)
  ) {
    const star = game.field[coordX][coordY];
    func(star, coordX, coordY);
  }
}
function remove(star, coordX, coordY) {
  if (star.activeStars.length >= game.minCountStarsBurn) {
    game.burnStar(star);
    score.value += score.countingScore(
      star.activeStars.length,
      game.minCountStarsBurn
    );
    addBonuse(star.activeStars.length);
    game.animationOfShootingStars(coordX, coordY);
    computedData("moves", --game.moves);
  }
  updateField(resetActiveStars);
  game.activeBomb = false;
  score.updateScore();
  statusGame();
}
function statusGame() {
  let status = null;
  if (checkWin()) {
    status = "Победа";
  } else if (checkLost()) {
    status = "Поражение";
  } else return;
  removeEvent();
  game.field = [];
  game.drawBackground();
  game.ctx.textAlign = "center";
  game.ctx.fillStyle = "#fff";
  game.ctx.font = "bold 30px sans-serif";
  game.ctx.fillText(status, game.sizeFieldX / 2, game.sizeFieldY / 2);
}
function checkWin() {
  return score.value >= score.max ? true : false;
}
function checkLost() {
  return game.moves < 1 ? true : false;
}
function addBonuse(count) {
  count > 5 && !game.activeBomb ? game.bonuse++ : false;
  computedData("bonuse", game.bonuse);
}
function updateField(func) {
  game.field = game.field.map((itemX) =>
    itemX.map((itemY) => {
      return func(itemY);
    })
  );
}
function resetActiveStars(itemY) {
  itemY.activeStars = [];
  return itemY;
}
function resetHover(itemY) {
  itemY.hover = false;
  return itemY;
}
