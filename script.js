function Gameboard(){
    const board = [];
    const row = 3;
    const column = 3;

    for(let i = 0; i < row; i++){
        board[i] = [];
        for(let j = 0; j < column; j++){
            board[i].push(Cell());
        }
    }

    const printBoard = () => {
        // for(let i = 0; i < row; i++){
        //     console.log("|" + board[i][0] + "|" + board[i][0] + "|");
        //     console.log("-----");
        // }
        const UI = gameUI();

        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );

        for(let i = 0; i < row;i++){
            for(let j = 0; j < column; j++){
                let index = i * 3 + j;    
                UI.gameCellBtn[index].textContent = boardWithCellValues[i][j];
            }
        }
    };

    const playerTurn = (row, column, player) => {
        if(board[row][column].getValue() === ''){
            board[row][column].addTurn(player);
            return true;
        }
        else{
            return false
        }
    };

    const getBoard = () => board;

    return { getBoard, printBoard, playerTurn };
}

function Cell(){
    let value = '';

    const addTurn = (player) => {
        value = player.token;
    };

    const getValue = () => value;

    return { addTurn, getValue };
}

function gameUI(){
    let gameCellBtn = [];

    gameCellBtn = document.getElementsByClassName("game-cell");

    return { gameCellBtn };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = Gameboard();
    const UI = gameUI();

    const players = [
        {
            name: playerOneName,
            token: 'X',
        },
        {
            name: playerTwoName,
            token: 'O',
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const printNewRound = () => {
        console.log(activePlayer.name + "'s Turn!");
        board.printBoard();
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        let success = board.playerTurn(row, column, activePlayer);
        if (success){
            switchPlayerTurn();
        }
        else{
            console.log("The place is already taken!");
        }
        printNewRound();
    };

    const bindEvents = () => {
        for(let row = 0;row < 3; row++){
            for(let column = 0;column < 3; column++){
                const index = row * 3 + column;
                UI.gameCellBtn[index].addEventListener('click', (event) => {
                    playRound(row, column);
                });
            }
        }
    };

    bindEvents();
    printNewRound();

    return { playRound, getActivePlayer };
}

const game = new GameController();