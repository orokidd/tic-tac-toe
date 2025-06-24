const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => {
    return board;
  };
  const setBoard = (position, marker) => {
    if (board[position]) return; // return if board already filled
    board[position] = marker;
    return true;
  };
  const resetBoard = () => board.fill("");

  return { getBoard, setBoard, resetBoard };
})();

const gamePlayer = (() => {
  let player1 = {
    name: "",
    marker: "X",
  };
  let player2 = {
    name: "",
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

  const getPlayer = (number) => {
    if (number === 1) {
      return player1;
    }
    if (number === 2) {
      return player2;
    }
  };

  return { getPlayer, setPlayer };
})();

const gameMode = (() => {
  let againstComputer = true;

  const isAgainstComputer = () => againstComputer;

  const setAgainstComputer = (value) => {
    againstComputer = value;
  };

  return { isAgainstComputer, setAgainstComputer }
})();

const gameLogic = (() => {
  let currentPlayer = gamePlayer.getPlayer(1);
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
        return;
      }
    }

    if (!board.includes("")) {
      gameActive = false;
      displayController.updateMessage("Game over, It's a tie!");
    }
  };

  const playerInput = (position) => {
    if (!gameActive) return;
    const input = gameBoard.setBoard(position, currentPlayer.marker);
    if (input) {
      displayController.updateBoard(board);
      checkWinner();
      switchPlayer();
    }
  };

  const switchPlayer = () => {
    if (gameActive) {
      currentPlayer =
        currentPlayer === gamePlayer.getPlayer(1)
          ? gamePlayer.getPlayer(2)
          : gamePlayer.getPlayer(1);
      displayController.updateMessage(`It's ${currentPlayer.name}'s turn`);

      if (gameMode.isAgainstComputer() && currentPlayer === gamePlayer.getPlayer(2)) {
        const randomIndex = getComputerInput();
        playerInput(randomIndex);
      }
    }
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    displayController.updateBoard(board);
    currentPlayer = gamePlayer.getPlayer(1);
    gameActive = true;
    displayController.updateMessage(
      `Game Restarted, It's ${currentPlayer.name}'s turn`
    );
  };

  const getComputerInput = () => {
    const board = gameBoard.getBoard();
    const emptyIndexes = board
      .map((value, index) => (value === "" ? index : null))
      .filter((index) => index !== null);

    if (emptyIndexes.length === 0) return null; // board is full

    const randomIndex = Math.floor(Math.random() * emptyIndexes.length);
    return emptyIndexes[randomIndex];
  };

  return {
    checkWinner,
    playerInput,
    switchPlayer,
    resetGame
  };
})();

const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const message = document.querySelector("#status");
  const resetButton = document.querySelector("#reset");
  const startBtn = document.getElementById("player-form");

  const selectModeModal = document.getElementById("select-mode-modal");
  const startModal = document.getElementById("start-modal");
  const inputPlayerTwoContainer = document.getElementById("player-two-selection")
  const inputPlayerTwoName = document.querySelector("input#player-two")

  const modeComputerBtn = document.getElementById("mode-computer");
  const modeHumanBtn = document.getElementById("mode-human");

  const gameSection = document.querySelector(".game-container")

  document
    .getElementById("mode-selection-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
    });

  modeComputerBtn.addEventListener("click", () => {
    selectModeModal.style.display = "none"
    startModal.style.display = "flex"
    inputPlayerTwoContainer.style.display = "none"
    inputPlayerTwoName.value = "Computer"
  });

  modeHumanBtn.addEventListener("click", () => {
    selectModeModal.style.display = "none"
    startModal.style.display = "flex"
    gameMode.setAgainstComputer(false);
  });

  const updateBoard = (board) => {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const updateMessage = (content) => {
    message.textContent = content;
  };

  const setPlayerInfo = () => {
    const playerOneName = document.querySelector(".player-one-info .username");
    const playerTwoName = document.querySelector(".player-two-info .username");

    playerOneName.textContent = `${gamePlayer.getPlayer(1).name}`;
    playerTwoName.textContent = `${gamePlayer.getPlayer(2).name}`;
  };

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      gameLogic.playerInput(index);
    });
  });

  resetButton.addEventListener("click", gameLogic.resetGame);

  startBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    const playerOne = document.getElementById("player-one");
    const playerTwo = document.getElementById("player-two");
    const currentPlayer = gamePlayer.getPlayer(1);

    gamePlayer.setPlayer(1, playerOne.value);
    gamePlayer.setPlayer(2, playerTwo.value);
    updateMessage(`It's ${currentPlayer.name}'s turn`);
    setPlayerInfo();
    startModal.style.display = "none"
    gameSection.style.display = "block"
  });

  return { updateBoard, updateMessage };
})();
