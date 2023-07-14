class Tile {
  constructor(pos, value) {
    this.pos = pos
    this.moved = this.merged = false

    if (value == null) {
      let percent = Math.floor(Math.random() * 100)
      this.value = percent > 90 ? 4 : 2
    } else {
      this.value = value
    }
  }
}

class Vector{
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  plus(that) {
    return new Vector(this.x + that.x, this.y + that.y)
  }
}