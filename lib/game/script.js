import Grid from "./grid.js";
import Tile from "./tile.js";

let gameBoard, grid, totalScore, setLostState, setScore;

export const cleanUp = [];

export function initGame(func, _setScore) {
  gameBoard = document.getElementById("game-board");

  grid = new Grid(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  setLostState = func;
  setScore = _setScore;
  setupInput();
}

function setupInput(rerun = false) {
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  if (rerun && isMobile()) return;

  window.addEventListener("keydown", keyDown, { once: true });

  let start = { x: undefined, y: undefined };
  let isMoved = false;

  async function keyDown(e) {
    await handleInput(e.key);
  }

  function touchStart(e) {
    start.x = e.touches[0].clientX;
    start.y = e.touches[0].clientY;
  }

  async function touchMove(e) {
    e.preventDefault();
    let x = e.touches[0].clientX - start.x;
    let y = e.touches[0].clientY - start.y;

    const PASS = 50;

    if ((Math.abs(x) > PASS || Math.abs(y) > PASS) && !isMoved) {
      console.log("here", isMoved);
      isMoved = true;
      if (Math.abs(x) > Math.abs(y)) {
        await handleInput(x < 0 ? "ArrowLeft" : "ArrowRight");
      } else {
        await handleInput(y > 0 ? "ArrowDown" : "ArrowUp");
      }
    }
  }

  function touchEnd() {
    isMoved = false;
  }

  window.addEventListener("touchstart", touchStart);
  window.addEventListener("touchmove", touchMove, {
    passive: false,
  });

  window.addEventListener("touchend", touchEnd);

  window.addEventListener("blur", touchEnd);

  cleanUp.push(() => {
    window.removeEventListener("touchstart", touchStart);
    window.removeEventListener("touchmove", touchMove, { passive: false });

    window.removeEventListener("touchend", touchEnd);

    window.removeEventListener("blur", touchEnd);
    window.removeEventListener("keydown", keyDown, { once: true });
  });
}

async function handleInput(key) {
  switch (key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput(true);
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput(true);
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput(true);
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput(true);
        return;
      }
      await moveRight();
      break;
    default:
      setupInput(true);
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      setLostState(true);
    });
    return;
  }

  totalScore = calculateScore();
  setupInput(true);

  setScore(totalScore);
}

function initScore() {
  // const prevScore = +document.getElementById("score").textContent;
  // document.getElementById("score").textContent = totalScore;
  // setScore(totalScore);
  // let added = document.createElement("div");
  // added.textContent = "+" + (totalScore - prevScore);
  // document.getElementById("scorecard_wrapper").appendChild(added);
  // added.classList.add("scorecard");
  // added.classList.add("animate-float");
  // added.addEventListener("animationend", () => {
  //   added.remove();
  // });
}

async function moveUp() {
  return await slideTiles(grid.cellsByColumn);
}

async function moveDown() {
  return await slideTiles(
    grid.cellsByColumn.map((column) => [...column].reverse())
  );
}

async function moveLeft() {
  return await slideTiles(grid.cellsByRow);
}

async function moveRight() {
  return await slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

function calculateScore() {
  return grid.cellsByColumn.reduce((acc, cur) => {
    return (
      acc + cur.filter((e) => e.tile).reduce((a, c) => a + c.tile.value, 0)
    );
  }, 0);
}
