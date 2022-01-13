class Game {
  constructor() {
    this.setup();
    let display = this.display = new Display(this.grid);

    display.drawScreen();
    display.drawTiles();
    display.updateScores(this.score, this.bestScore);
  }

  setup() {
    const state = JSON.parse(localStorage.getItem("Game-State"));

    if (state) {
      Object.assign(this, state, { grid: new Grid(4, state.grid) });
    } else {
      Object.assign(this, {
        grid: new Grid(4),
        score: 0,
        bestScore: 0,
        status: null
      })
      this.addStartTiles();
    }
  }
  addStartTiles() {
    const tilesCount = 2;
    for (let i = 0; i < tilesCount; i++) {
      this.grid.addTileRandomly();
    }
  }
  act(direction) {
    let move = Game.moves[direction];

    if (move) {
      move.call(this);
      let moved = this.grid.some(tile => tile.moved);
      if (moved) {
        this.grid.addTileRandomly();
        this.display.drawTiles();
        this.save();

        if (this.isLost()) { // Game Over
          let newRecord = this.score == this.bestScore;
          alert(`You lose! You got ${this.score} points.${
                newRecord ? " Best score!" : ""}`);
        }
      }
    }
  }
  move(tile, direction) {
    let destination, other;
    tile.moved = tile.merged = false;

    while (this.grid.moveAvailable(
           destination = tile.pos.plus(direction))) {
      this.grid.set(tile.pos, null);
      this.grid.set(destination, tile);
      tile.pos = destination;
      tile.moved = true;
    }

    if (this.grid.isInside(destination) &&
        (other = this.grid.get(destination))) {
      if (tile.value == other.value && !other.merged) {
        this.merge(tile, other);
      }
    }
  }
  merge(tile, other) {
    let merged = new Tile(other.pos, tile.value * 2);
    this.grid.set(tile.pos, null);
    this.grid.set(other.pos, merged);
    merged.merged = merged.moved = true;

    this.score += merged.value;
    this.bestScore = (this.score > this.bestScore) ?
                        this.score : this.bestScore;
    this.display.updateScores(this.score, this.bestScore);

    if (merged.value == 2048 && this.status === null) {
      let keepPlaying = confirm("You win! Do you want to continue?");
      if (keepPlaying) this.status = "won";
      else this.restart();
    }
  }
  isLost() {
    return !this.grid.mergesAvailable() &&
            this.grid.getEmptyCells() == null;
  }
  restart() {
    let bestScore = this.bestScore;

    this.clear();
    this.setup();
    this.bestScore = bestScore;
    this.display = new Display(this.grid);

    this.display.drawTiles();
    this.display.updateScores(this.score, this.bestScore);
  }
  save() {
    localStorage.setItem("Game-State", JSON.stringify(this));
  }
  clear() { localStorage.setItem("Game-State", null); }
  toJSON() {
    return {
      grid: {
        cells: this.grid.cells, size: this.grid.size},
      score: this.score,
      bestScore: this.bestScore,
      status: this.status
    }
  }
}

Game.moves = Object.create(null);

Game.moves.ArrowUp = function() {
  let up = new Vector(0, -1);

  this.grid.each(tile => {
    this.move(tile, up);
  }, this);
}
Game.moves.ArrowRight = function() {
  let right = new Vector(1, 0), size = this.grid.size;

  for (let y = 0; y < size; y++) {
    for (let x = size - 1; x >= 0; x--) {
      let cell = this.grid.get(new Vector(x, y));
      if (cell instanceof Tile) {
        this.move(cell, right);
      }
    }
  }
}
Game.moves.ArrowDown = function() {
  let down = new Vector(0, 1), size = this.grid.size;

  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      let cell = this.grid.get(new Vector(x, y));
      if (cell instanceof Tile) {
        this.move(cell, down);
      }
    }
  }
}
Game.moves.ArrowLeft = function() {
  let left = new Vector(-1, 0);

  this.grid.each(tile => {
    this.move(tile, left);
  });
}
