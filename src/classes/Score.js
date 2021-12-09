export default class Score {
  constructor (_max) {
    this.value = 0
    this.max = _max
    this.score = document.querySelector('#score')
    this.progress = document.querySelector('#progress')
    this.progress.max = this.max
  }
  updateScore () {
    this.score.innerHTML = this.value
    this.progress.value = this.value
  }
  countingScore (count, minCountStarsBurn) {
    if (count >= minCountStarsBurn) {
        return count + this.countingScore(count - 1, minCountStarsBurn)
    }
    return 0
  }
}