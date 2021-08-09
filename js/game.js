function Game(wrapper, Display) {
  this.setup();
  this.display = new Display(wrapper, this.grid);

  this.display.drawScreen();
  this.display.drawBlocks();
}

Game.prototype.setup = function() {
  const previousState = this.getState();

  if (previousState) {
    this.grid      = new Grid(4, previousState.grid.cells);
    this.score     = previousState.score;
    this.bestScore = previousState.bestScore;
    this.status    = previousState.status;
  } else {
    this.grid      = new Grid(4);
    this.score     = this.bestScore = 0;
    this.status    = null;
    this.addStartBlocks();
  }
}

Game.prototype.getState = function() {
  return;
}

Game.prototype.addStartBlocks = function() {
  const startBlocks = 2;

  for (let i = 0; i < startBlocks; i++)
    this.grid.addRandomBlock();
}

const moves = Object.create(null);

Game.prototype.moveBlocks = function(direction) {

  const move = moves[direction];

  if ( move )
    move.call(this);

  const moved = this.grid.some(function(block) {
    return block.moved === true;
  });

  if ( moved ) {
    this.grid.addRandomBlock();
    this.display.drawBlocks();
    this.saveState();

    if (this.isOver()) // Game Over
      alert(`You lose! You got ${this.score} points.`+
            `${(this.score == this.bestScore) ? " Best score!" : ""}`);
  }
}

moves.ArrowUp = function() {
  const up = new Vector(0, -1);

  this.grid.each(function(block) {
    this.moveBlockUntilCollide(block, up);
  }, this);
}

moves.ArrowRight = function() {
  const right = new Vector(1, 0);

  for (let y = 0; y < this.grid.size; y++) {
    for (let x = this.grid.size - 1; x >= 0; x--) {
      const block = this.grid.get(new Vector(x, y));
      if (block instanceof Block)
        this.moveBlockUntilCollide(block, right);
    }
  }
}

moves.ArrowDown = function() {
  const down = new Vector(0, 1);

  for (let y = this.grid.size - 1; y >= 0; y--) {
    for (let x = 0; x < this.grid.size; x++) {
      const block = this.grid.get(new Vector(x, y));
      if (block instanceof Block)
        this.moveBlockUntilCollide(block, down);
    }
  }
}

moves.ArrowLeft = function() {
  const left = new Vector(-1, 0);

  this.grid.each(function(block) {
    this.moveBlockUntilCollide(block, left);
  }, this);
}

Game.prototype.saveState = function() {
  localStorage.setItem("Game-State", JSON.stringify(this));
}

Game.prototype.isOver = function() {
  return !this.grid.mergesAvailable() &&
         !this.grid.getEmptyCells().length
}

Game.prototype.moveBlockUntilCollide = function(block, direction) {
  let destination, other;

  block.moved = block.merged = false;

  while (this.grid.moveAvailable(
         destination = block.position.plus(direction))) {
    this.grid.move(block, destination);
  }

  if (this.grid.isInside(destination) &&
      (other = this.grid.get(destination)))
    this.mergeBlocksIfEquals(block, other);
}

Game.prototype.mergeBlocksIfEquals = function(block, other) {
  if (block.value == other.value && !other.merged) {
    const merged   = this.grid.mergeAndReturn(block, other);
    this.score    += merged.value;
    this.bestScore = (this.score > this.bestScore) ?
                      this.score : this.bestScore;
    
    this.display.updateScoreAndBestScore(this.score,
                                      this.bestScore);
    
    if (merged.value == 2048 && this.status === null)
      if ( confirm("You win! Want you to continue?") )
        this.status = "won";
      else
        this.restart();
  }
}

Game.prototype.restart = function() {
  const bestScore = this.bestScore;

  this.clearState();
  this.setup();

  this.bestScore = bestScore;

  this.display.update(this.grid);
  this.display.drawBlocks();
  this.display.updateScoreAndBestScore(this.score,
                                    this.bestScore);
}

Game.prototype.clearState = function() {
  localStorage.clear();
}