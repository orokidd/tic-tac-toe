const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => {
    return board;
  };
  const setBoard = (position, marker) => {
    board[position] = marker;
  };
  const resetBoard = () => board.fill("");

  return { getBoard, setBoard, resetBoard };
})();

const gamePlayer = (() => {
  let player1 = {
    name: "Player 1",
    marker: "X",
  };
  let player2 = {
    name: "Player 2",
    marker: "O",
  };

  const setPlayer = (number, name) => {
    if (number === 1) {
      player1.name = name;
    }
    if (number === 2) {
      player2.name = name;
    }
  };

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  return { getPlayer1, getPlayer2, setPlayer };
})();

const gameLogic = (() => {
  let currentPlayer = gamePlayer.getPlayer1();
  let gameActive = true;
  const board = gameBoard.getBoard();
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = () => {
    for (let condition of winningConditions) {
      const [first, second, third] = condition;
      if (
        board[first] &&
        board[first] === board[second] &&
        board[first] === board[third]
      ) {
        gameActive = false;
        displayController.updateMessage(
          `Game over! The winner is ${currentPlayer.name}`
        );
      }
    }

    if (!board.includes("")) {
      gameActive = false;
      displayController.updateMessage("Game over, It's a tie!");
    }
  };

  const playerInput = (position) => {
    if (!gameActive) return;

    gameBoard.setBoard(position, currentPlayer.marker);
    displayController.updateBoard(board);
    checkWinner();
    switchPlayer();
  };

  const switchPlayer = () => {
    if (gameActive) {
      currentPlayer =
        currentPlayer === gamePlayer.getPlayer1()
          ? gamePlayer.getPlayer2()
          : gamePlayer.getPlayer1();
      displayController.updateMessage(`It's ${currentPlayer.name}'s turn`);
    }
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    displayController.updateBoard(board);
    displayController.updateMessage("Game Restarted");
    gameActive = true;
    currentPlayer = gamePlayer.getPlayer1();
  };

  return { checkWinner, playerInput, switchPlayer, resetGame };
})();

const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const message = document.querySelector("#status");
  const resetButton = document.querySelector("#reset");
  const modal = document.getElementById("start-modal");
  const startBtn = document.getElementById("start-btn");

  const updateBoard = (board) => {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const updateMessage = (content) => {
    message.textContent = content;
  };

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      gameLogic.playerInput(index);
    });
  });

  resetButton.addEventListener("click", gameLogic.resetGame);

  window.addEventListener("DOMContentLoaded", () => {
    if (modal) {
      modal.showModal();
    }
  });

  startBtn.addEventListener("click", () => {
    const playerOne = document.getElementById("player-one");
    const playerTwo = document.getElementById("player-two");
    const currentPlayer = gamePlayer.getPlayer1();

    gamePlayer.setPlayer(1, playerOne.value);
    gamePlayer.setPlayer(2, playerTwo.value);
    updateMessage(`It's ${currentPlayer.name}'s turn`);
    modal.close();
  });

  return { updateBoard, updateMessage };
})();
