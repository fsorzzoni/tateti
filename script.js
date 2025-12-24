const Gameboard = (function() {

    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const cross = "X";
    const circle = "O";
    let currentTurn = cross;
    let playerX = "";
    let playerO = "";

    function restartGameboard() {
        currentTurn = cross;
        board.forEach(row => {
            row.fill("");
        });
    }

    function toggleTurnSymbol() {
        if(currentTurn === cross) {
            currentTurn = circle;
        } else {
            currentTurn = cross;
        }
    }

    function getCurrentTurn() {
        return currentTurn;
    }

    // Si no se pudo hacer la jugada: null. Si se pudo hacer { gameState: gameState }.
    function makePlay(row, column) {
        if(isPlaceEmpty(row, column)) {
            board[row][column] = currentTurn;
            const gRes = getGameResult();
            toggleTurnSymbol();
            console.log({ validPlay: true, gameResult: gRes });
            return { validPlay: true, gameResult: gRes };
        }
        return { validPlay: false };
    }

    function isPlaceEmpty(row, column) {
        return board[row][column] === "";
    }

    // Si no termino: null. Si hay empate: { winner: null }. Si hay ganador: { winner: symbol, type: type, index: i }.
    function getGameResult() {
        let i = isRowWin();
        if(i !== null) {
            return { winner: currentTurn, type: "row", index: i };
        }
        i = isColumnWin();
        if(i !== null) {
            return { winner: currentTurn, type: "column", index: i };
        }
        i = isDiagonalWin();
        if(i !== null) {
            return { winner: currentTurn, type: "diagonal", index: i };
        }
        return isGameTie();
    }

    // Si hay ganador: index. Si no hay: null.
    function isArrWin(array) {
        for(let i = 0; i < array.length; i++) {
            if(array[i].every(sym => sym === currentTurn)) {
                return i;
            }
        }
        return null;
    }

    function isRowWin() {
        return isArrWin(board);
    }

    function getColumnArray() {
        const columnArray = [[], [], []];
        for(let i = 0; i < board.length; i++) {
            columnArray[0].push(board[i][0]);
            columnArray[1].push(board[i][1]);
            columnArray[2].push(board[i][2]);
        }
        return columnArray;
    }

    function isColumnWin() {
        return isArrWin(getColumnArray());
    }

    function getDiagonalArray() {
        const diag1 = [board[0][0], board[1][1], board[2][2]];
        const diag2 = [board[0][2], board[1][1], board[2][0]];
        return [diag1, diag2];
    }

    function isDiagonalWin() {
        return isArrWin(getDiagonalArray());
    }

    function isGameTie() {
        if(board.every(row => row.every(sym => sym !== ""))) {
            return { winner: null };
        }
        return null;
    }

    function getBoardState() {
        return board.map(row => row.slice());
    }

    function getPlayerX() {
        return playerX;
    }

    function setPlayerX(name) {
        playerX = name;
    }

    function getPlayerO() {
        return playerO;
    }

    function setPlayerO(name) {
        playerO = name;
    }

    return {
        restartGameboard,
        makePlay,
        getBoardState,
        getCurrentTurn,
        getPlayerX,
        setPlayerX,
        getPlayerO,
        setPlayerO,
    };
})();


const Display = (function(board, doc) {
    const container = doc.querySelector(".container");
    const turnIndicator = doc.querySelector(".turn-indicator");
    const newGame = doc.querySelector("#new-game");
    const finishedGame = doc.querySelector("#finished-game");
    const gameResultDisplay = doc.querySelector("#finished-game > div")
    const form = doc.querySelector("form");
    const name1 = doc.querySelector("#name1");
    const name2 = doc.querySelector("#name2");

    function resetDisplay() {
        const boardArr = board.getBoardState();
        for(let i = 0; i < boardArr.length; i++) {
            for(let j = 0; j < boardArr[i].length; j++) {
                const grid = document.querySelector(".grid[data-row= \"" + i +"\"][data-col=\"" + j + "\"]");
                const element = boardArr[i][j];
                grid.textContent = element;
            }
        }
        turnIndicator.textContent = board.getCurrentTurn();
        name1.textContent = board.getPlayerX();
        name2.textContent = board.getPlayerO();
    }

    container.addEventListener("click", (event) => {
        if(event.target.closest(".grid-container") !== null) {
            const grid = event.target.closest(".grid");
            if(grid !== null) {
                const row = Number(grid.dataset.row);
                const col = Number(grid.dataset.col);
                const gameRes = board.makePlay(row, col);
                if(gameRes.validPlay) {
                    if(gameRes.gameResult !== null) {
                        finishedGame.showModal();
                        if(gameRes.gameResult.winner === null) {
                        gameResultDisplay.textContent = "Game result: Tie!";
                        } else {
                            gameResultDisplay.textContent = "Game result: " + gameRes.gameResult.winner + " wins!";
                        }
                    }
                    resetDisplay();
                }
            }
        }
        if(event.target.closest(".misc-container") !== null) {
            if(event.target.id === "restart") {
                board.restartGameboard();
                resetDisplay();
            }
            if(event.target.id === "new-game-btn") {
                newGame.showModal();
            }
        }
        
    });

    doc.addEventListener("click", (event) => {
        if(event.target.id === "continue") {
            finishedGame.close();
            board.restartGameboard();
            resetDisplay();
        }
    });

    form.addEventListener("submit", (event) => {
        const formData = new FormData(form);

        board.setPlayerX(formData.get("player-x"));
        board.setPlayerO(formData.get("player-o"));
        board.restartGameboard();

        resetDisplay();
    });

    newGame.showModal();
    resetDisplay();

})(Gameboard, document);