function DOMDisplay(wrapper, grid) {
  this.wrapper = wrapper;
  this.grid = grid;
}

DOMDisplay.prototype.drawScreen = function() {
  const screen = elt("table", "grid");

  for (let y = 0; y < this.grid.size; y++) {
    const lineElt = screen.appendChild(elt("tr"));
    for (let x = 0; x < this.grid.size; x++) {
      lineElt.appendChild(elt("td"))
    }
  }

  this.wrapper.appendChild(screen);

}

function elt(node, className) {
  let elt = document.createElement(node);
  if (className) elt.className = className;

  return elt;
}