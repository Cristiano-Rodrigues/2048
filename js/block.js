function Block(position, value) {
  this.position = position;
  this.value = value || this.getRandomValue();
  this.merged = this.moved = false;
}

Block.prototype.getRandomValue = function() {
  const random = Math.floor(Math.random() * 100);

  return (random > 90) ? 4 : 2;
}