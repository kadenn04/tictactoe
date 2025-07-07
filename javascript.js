const gameboard = (function () {
    board = [0,0,0,0,0,0,0,0,0];
    
    const printBoard = () => console.log(board);

    const resetBoard = () => {
        board = [0,0,0,0,0,0,0,0,0];
    }

    const checkWin = (loc) => {
        // columns
        let column = loc % 3 ;
        if ((board[column] === board[column+3]) && (board[column] === board[column+6])) {
            return true;
        }

        let row = 3*Math.floor(loc / 3)
        if ((board[row] === board[row+1]) && (board[row] === board[row+2])) {
            return true;
        }

        if (loc === 0 || loc === 4 || loc === 8) {
            if ((board[0] === board[4]) && (board[0] === board[8])) {
                return true;
            }
        }

        if (loc === 2 || loc === 4 || loc === 6) {
            if ((board[2] === board[4]) && (board[2] === board[6])) {
                return true;
            }
        }
        return false;
    }

    const playSymbol = (symbol, loc) => {
        if (board[loc] != 0) return false;
        else {
            board[loc] = symbol; 
            return true
        }
    };

    return { printBoard, playSymbol, checkWin, resetBoard}
})();

const GameController = (function (
    playerOneName = "Player One", 
    playerTwoName = "Player Two"
) {
    const players = [
        {
            name: playerOneName,
            symbol: "X"
        },
        {
            name: playerTwoName,
            symbol: "O"
        }
    ];

    let activePlayer = players[0];
    
    const switchPlayerTurn = () => {activePlayer = activePlayer === players[0] ? players[1] : players[0]};
    const getActivePlayer = () => activePlayer;
    
    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
        console.log({roundNum});
    }

    var roundNum = 1;

    const playRound = (loc) => {
        console.log(`Playing ${getActivePlayer().symbol} into ${loc}`);
        if (gameboard.playSymbol(getActivePlayer().symbol, loc)) {
            currentGridSquare = document.querySelector("#grid-square-"+loc.toString());
            currentGridSquare.textContent = getActivePlayer().symbol;
            currentGridSquare.classList.add("selected");
            if (gameboard.checkWin(loc)) {
                declareWinner();
            } else if (roundNum === 9) {
                console.log(`Tie!`)
            } else {
                switchPlayerTurn();
                printNewRound();
                roundNum += 1;
            }
            }   
        else {
            console.log("ERROR: already a symbol there!")
        }
    }

    printNewRound();

    const resetBoard = () => { 
        gameboard.resetBoard();
        for (let i=0; i<9; i++) {
            document.querySelector("#grid-square-"+i.toString()).textContent = "";
        };
        roundNum = 1;
    }

    var oScore = 0;
    var xScore = 0;

    const declareWinner = () => {
        console.log(`${getActivePlayer().symbol} wins!`);
        if (getActivePlayer().symbol == "X") {
            ++xScore; 
            document.querySelector("#x-score").textContent=xScore;
        } else {
            ++oScore;
            document.querySelector("#o-score").textContent=oScore;
        }
        resetBoard();
    }

    const resetGame = () => {
        resetBoard();
        oScore = 0;
        xScore = 0;
        document.querySelector("#o-score").textContent=oScore;
        document.querySelector("#x-score").textContent=xScore;
    }

    return {
        playRound,
        getActivePlayer,
        resetBoard,
        resetGame,
    };
})();

const container = document.querySelector("#game-container");

for (let i=0; i<9; i++) {
    var gridSquare = document.createElement("button");
    gridSquare.classList.add("grid-square");
    gridSquare.id = "grid-square-" + i.toString();
    gridSquare.textContent = "";

    gridSquare.addEventListener("click", () => {
        GameController.playRound(i);
    })

    container.append(gridSquare);
}

const resetBoardButton = document.querySelector("#reset-board");
resetBoardButton.addEventListener("click", () => {
    GameController.resetBoard();
    console.log("resetting board");
})

const resetGameButton = document.querySelector("#reset-game");
resetGameButton.addEventListener("click", () => {
    GameController.resetGame();
    console.log("resetting game");
})
