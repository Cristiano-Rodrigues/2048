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

  this.display.drawBlocks();
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
      const block = this.grid.getContent(new Vector(x, y));
      if (block instanceof Block)
        this.moveBlockUntilCollide(block, right);
    }
  }
}

moves.ArrowDown = function() {
  const down = new Vector(0, 1);

  for (let y = this.grid.size - 1; y >= 0; y--) {
    for (let x = 0; x < this.grid.size; x++) {
      const block = this.grid.getContent(new Vector(x, y));
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

Game.prototype.moveBlockUntilCollide = function(block, direction) {
  let destination;

  while (this.grid.moveAvailable(
         destination = block.position.plus(direction))) {
    block = this.grid.moveAndReturn(block, destination);
  }
}