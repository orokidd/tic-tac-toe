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
    return number === 1 ? player1 : player2;
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
  const board = gameBoard.getBoard();
  let currentPlayer = gamePlayer.getPlayer(1);
  let gameActive = true;
  
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
        // Prevent empty string "" to return true
        board[first] &&
        board[first] === board[second] &&
        board[first] === board[third]
      ) {
        stopGame();
        displayController.updateMessage(`Game over! The winner is ${currentPlayer.name}`);
        return;
      }
    }

    if (!board.includes("")) {
      stopGame();
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
      currentPlayer = currentPlayer === gamePlayer.getPlayer(1) ? gamePlayer.getPlayer(2) : gamePlayer.getPlayer(1);
      displayController.updateMessage(`It's ${currentPlayer.name}'s turn`);

      if (gameMode.isAgainstComputer() && currentPlayer === gamePlayer.getPlayer(2)) {
        computerInput();
      }
    }
  };

  const computerInput = () => {
    if (!gameActive) return;
    const randomIndex = getComputerInput();
    const input = gameBoard.setBoard(randomIndex, currentPlayer.marker);

    if (input) {
      displayController.updateBoard(board);
      checkWinner();
      switchPlayer();
    }
  }

  const getComputerInput = () => {
    const board = gameBoard.getBoard();
    const emptyIndexes = board.map((value, index) => (value === "" ? index : null)).filter((index) => index !== null);

    if (emptyIndexes.length === 0) return null; // board is full

    const randomIndex = Math.floor(Math.random() * emptyIndexes.length);
    return emptyIndexes[randomIndex];
  };
  
  const stopGame = () => {
    gameActive = false;
  }

  const resetGame = () => {
    gameBoard.resetBoard();
    displayController.updateBoard(board);
    currentPlayer = gamePlayer.getPlayer(1);
    gameActive = true;
    displayController.updateMessage(
      `Game Restarted, It's ${currentPlayer.name}'s turn`
    );
  };

  return { checkWinner, playerInput, switchPlayer, resetGame };
})();

const displayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const resetButton = document.querySelector("#reset");
  const startBtn = document.getElementById("start-btn");
  const modeComputerBtn = document.getElementById("mode-computer");
  const modeHumanBtn = document.getElementById("mode-human");

  modeComputerBtn.addEventListener("click", () => {
    hideModeSelection()
    showPlayerNameSelection()
    hidePlayerTwoNameInput()
  });

  modeHumanBtn.addEventListener("click", () => {
    hideModeSelection()
    showPlayerNameSelection()
    gameMode.setAgainstComputer(false);
  });

    cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      gameLogic.playerInput(index);
    });
  });

  resetButton.addEventListener("click", gameLogic.resetGame);

  startBtn.addEventListener("click", (e) => {
    const playerOne = document.getElementById("player-one");
    const playerTwo = document.getElementById("player-two");
    const currentPlayer = gamePlayer.getPlayer(1);

    gamePlayer.setPlayer(1, playerOne.value.trim() || "Player 1");
    gamePlayer.setPlayer(2, playerTwo.value.trim() || "Player 2");
    updateMessage(`It's ${currentPlayer.name}'s turn`);
    setPlayerInfo();
    hidePlayerNameSelection()
    showGameSection()
  });

  const hideModeSelection = () => {
    const selectModeModal = document.getElementById("select-mode-modal");

    selectModeModal.style.display = "none"
  }

  const showPlayerNameSelection = () => {
    const startModal = document.getElementById("start-modal");

    startModal.style.display = "flex"
  }

  const hidePlayerNameSelection = () => {
    const startModal = document.getElementById("start-modal");

    startModal.style.display = "none"
  }

  const hidePlayerTwoNameInput = () => {
    const inputPlayerTwoContainer = document.getElementById("player-two-selection")
    const inputPlayerTwoName = document.querySelector("input#player-two")

    inputPlayerTwoContainer.style.display = "none"
    inputPlayerTwoName.value = "Computer"
  }

  const showGameSection = () => {
    const gameSection = document.querySelector(".game-container")

    gameSection.style.display = "block"
  }

  const updateBoard = (board) => {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const updateMessage = (content) => {
    const message = document.querySelector("#status");

    message.textContent = content;
  };

  const setPlayerInfo = () => {
    const playerOneName = document.querySelector(".player-one-info .username");
    const playerTwoName = document.querySelector(".player-two-info .username");

    playerOneName.textContent = `${gamePlayer.getPlayer(1).name}`;
    playerTwoName.textContent = `${gamePlayer.getPlayer(2).name}`;
  };

  return { updateBoard, updateMessage };
})();
