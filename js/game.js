function Game(wrapper, Display) {
  this.grid = new Grid(4);
  this.display = new Display(wrapper, this.grid);
  this.display.drawScreen();
}