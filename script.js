let clickedRow;
let clickedCell;
let result;
let currentPlayer = 1;
let party = new Audio("./assets/confetti.mp3");
let coin = new Audio("./assets/coin.mp3");
let array = [0, 0, 0, 0, 0, 0, 0];
let gameBoard = Array.from({ length: 6 }, () => Array(7).fill(0));
let partyPopper = document.getElementById("celebration");
partyPopper.style.display = "none";

window.addEventListener("load", () => {
  const rows = document.querySelectorAll(".row");
  rows.forEach((row) => {
    row.addEventListener("click", (event) => {
      clickedRow = row.classList[1];
      clickedCell = this.event.target.classList[1];
      array[clickedCell - 1] += 1;
      dropToken(clickedRow, clickedCell);
    });
  });
});

function dropToken(row, column) {
  row %= 5;
  column %= 8;
  const token = document.createElement("div");
  token.classList.add(`token${currentPlayer}`);

  for (let index = 0; index < array[column - 1]; index++) {
    let selectedRow = document.getElementsByClassName(`row ${index + 1}`);

    let selectedColumn = selectedRow[0].getElementsByClassName(
      `cell ${column}`
    );

    selectedColumn[0].appendChild(token);

    if (index === array[column - 1] - 1) {
      gameBoard[7 - selectedRow[0].className.split(" ")[1] - 1][
        selectedColumn[0].className.split(" ")[1] - 1
      ] = currentPlayer;

      result = checkWin(currentPlayer);
      checkResult(result);
    }
  }

  setTimeout(() => {
    token.style.animation = "none";
    token.style.transform = "translateY(0)";
  }, 3000);
  coin.play();
}

function checkWin(currentPlayer) {
  const rows = gameBoard.length;
  const cols = gameBoard[0].length;

  // Check horizontally
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols - 3; j++) {
      if (
        gameBoard[i][j] === currentPlayer &&
        gameBoard[i][j + 1] === currentPlayer &&
        gameBoard[i][j + 2] === currentPlayer &&
        gameBoard[i][j + 3] === currentPlayer
      ) {
        return {
          result: true,
          indices: [
            [i, j],
            [i, j + 1],
            [i, j + 2],
            [i, j + 3],
          ],
        };
      }
    }
  }

  // Check vertically
  for (let i = 0; i < rows - 3; i++) {
    for (let j = 0; j < cols; j++) {
      if (
        gameBoard[i][j] === currentPlayer &&
        gameBoard[i + 1][j] === currentPlayer &&
        gameBoard[i + 2][j] === currentPlayer &&
        gameBoard[i + 3][j] === currentPlayer
      ) {
        return {
          result: true,
          indices: [
            [i, j],
            [i + 1, j],
            [i + 2, j],
            [i + 3, j],
          ],
        };
      }
    }
  }

  // Check diagonally (from top-left to bottom-right)
  for (let i = 0; i < rows - 3; i++) {
    for (let j = 0; j < cols - 3; j++) {
      if (
        gameBoard[i][j] === currentPlayer &&
        gameBoard[i + 1][j + 1] === currentPlayer &&
        gameBoard[i + 2][j + 2] === currentPlayer &&
        gameBoard[i + 3][j + 3] === currentPlayer
      ) {
        return {
          result: true,
          indices: [
            [i, j],
            [i + 1, j + 1],
            [i + 2, j + 2],
            [i + 3, j + 3],
          ],
        };
      }
    }
  }

  // Check diagonally (from top-right to bottom-left)
  for (let i = 0; i < rows - 3; i++) {
    for (let j = cols - 1; j >= 3; j--) {
      if (
        gameBoard[i][j] === currentPlayer &&
        gameBoard[i + 1][j - 1] === currentPlayer &&
        gameBoard[i + 2][j - 2] === currentPlayer &&
        gameBoard[i + 3][j - 3] === currentPlayer
      ) {
        return {
          result: true,
          indices: [
            [i, j],
            [i + 1, j - 1],
            [i + 2, j - 2],
            [i + 3, j - 3],
          ],
        };
      }
    }
  }

  return false;
}

function checkResult(result) {
  if (result.result) {
    party.play();
    document.getElementById("turn").innerHTML = `Player ${currentPlayer}'s WON`;
    document.getElementById("header").innerHTML = `GAME OVER`;
    let arr = result.indices;
    for (const [row, col] of arr) {
      let selectedRow = document.getElementsByClassName(`row ${6 - row}`);
      let selectedColumn = selectedRow[0].getElementsByClassName(
        `cell ${col + 1}`
      );
      selectedColumn[0].classList.add(`win-cell`);
    }
    partyPopper.style.display = "";
    setTimeout(() => {
      reloadCountdown();
    }, 1000);
  } else {
    switchPlayer();
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 2 ? 1 : 2;
  document.getElementById("turn").innerHTML = `Player ${currentPlayer}'s Turn`;
}

function reloadCountdown() {
  const countdownText = document.getElementById("turn");
  let remainingTime = 10;

  const intervalId = setInterval(() => {
    remainingTime--;
    countdownText.textContent = `Reloading in ${remainingTime} sec.`;

    if (remainingTime === 0) {
      countdownText.textContent = "Reloading...";
      clearInterval(intervalId);
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }, 1000);
}
