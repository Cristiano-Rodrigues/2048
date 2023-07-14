class Display {
  constructor(grid) {
    this.grid = grid;
    this.wrapper = document.querySelector(".game-view");
  }
  drawScreen() {
    let table = document.createElement("table");
    table.className = "grid";

    let size = this.grid.size;
    for (let y = 0; y < size; y++) {
      let row = table.appendChild(document.createElement("tr"));
      for (let x = 0; x < size; x++) {
        row.appendChild(document.createElement("td"));
      }
    }
    this.wrapper.appendChild(table);
  }
  drawTiles() {
    let cells = this.wrapper.querySelectorAll("td");
    cells.forEach(cell => {
      for (let child of cell.children) {
        cell.removeChild(child);
      }
    });

    let size = this.grid.size;
    this.grid.each((tile, x, y) => {
      let cell = cells[x + size * y];
      let content = cell.appendChild(document.createElement("div"));
      content.className = `tile value-${tile.value}`;
      content.className += tile.merged ? " merged" : "";
      content.textContent = tile.value;
    });
  }
  updateScores(score, bestScore) {
    let scoreElt = document.querySelector(".score");
    let bestScoreElt = document.querySelector(".best-score");

    scoreElt.textContent = score;
    bestScoreElt.textContent = bestScore;
  }
}