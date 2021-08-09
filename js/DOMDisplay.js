function DOMDisplay(wrapper, grid) {
  this.wrapper = wrapper;
  this.grid = grid;
}

DOMDisplay.prototype.drawScreen = function() {
  const screen = elt("table", "grid");

  for (let y = 0; y < this.grid.size; y++) {
    const lineElt = screen.appendChild(elt("tr"));
    for (let x = 0; x < this.grid.size; x++)
      lineElt.appendChild(elt("td"));
  }

  this.wrapper.appendChild(screen);
}

DOMDisplay.prototype.drawBlocks = function() {
  const cells = this.wrapper.querySelectorAll("td");

  cells.forEach(clearCell);

  this.grid.each(block => {
    const cell = cells[block.position.y * this.grid.size +
                            block.position.x];

    const data = cell.appendChild(elt("div", "block"));

    data.textContent = block.value;
  });

  function clearCell(cell) {
    cell.firstChild && cell.removeChild(cell.firstChild);
  }
}

DOMDisplay.prototype.updateScoreAndBestScore = function(score, bestScore) {

}

DOMDisplay.prototype.update = function(grid) {
  this.grid = grid;
}

function elt(node, className) {
  let elt = document.createElement(node);
  if (className) elt.className = className;

  return elt;
}