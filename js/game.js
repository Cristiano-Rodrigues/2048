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