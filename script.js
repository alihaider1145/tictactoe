function Gameboard(){
    const board = [];
    const row = 3;
    const column = 3;
    const UI = GameUI();

    for(let i = 0; i < row; i++){
        board[i] = [];
        for(let j = 0; j < column; j++){
            board[i].push(Cell());
        }
    }

    const getBoardWithCellValues = () => 
        board.map((row) =>
            row.map((cell) => cell.getValue())); //returns the board with cell values

    const printBoard = () => {
        for(let i = 0; i < row;i++){
            for(let j = 0; j < column; j++){
                let index = i * 3 + j;    
                UI.getCellBtn()[index].textContent = getBoardWithCellValues()[i][j];
            }
        }
    };

    const printAnnouncement = (activePlayer, condition) => {
        if (condition === 'turn'){
            UI.getGameAnnouncement().textContent = activePlayer.name + "'s turn!";
        }
        else if(condition === 'draw'){
            UI.getGameAnnouncement().textContent = "It's a draw!";
        }
        else if (condition === 'win'){
            UI.getGameAnnouncement().textContent = activePlayer.name + " won!";
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

    return { getBoardWithCellValues, printBoard, playerTurn, printAnnouncement };
}

function Cell(){
    let value = '';

    const addTurn = (player) => {
        value = player.token;
    };

    const getValue = () => value;

    return { addTurn, getValue };
}

function GameUI(){
    let cellBtn = [];

    const gameAnnouncement = document.querySelector(".game-announcement");
    cellBtn = document.getElementsByClassName("game-cell");

    const getCellBtn = () => cellBtn;

    const getGameAnnouncement = () => gameAnnouncement;

    return { getCellBtn, getGameAnnouncement};
}

(function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = Gameboard();
    const UI = GameUI();

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

    const checkWinner = () => {
        for(let i = 0;i < 3;i++){
            if(
                (board.getBoardWithCellValues()[i][i] != '') 
                && 
                (
                    (board.getBoardWithCellValues()[i][1] === board.getBoardWithCellValues()[i][2])
                    &&
                    (board.getBoardWithCellValues()[i][2] === board.getBoardWithCellValues()[i][0])
                    &&
                    (board.getBoardWithCellValues()[i][1] === board.getBoardWithCellValues()[i][0])
                )
            ){
                board.printAnnouncement(activePlayer, 'win');
                return true;
            }
            else if( 
                (board.getBoardWithCellValues()[i][i] != '')  
                && 
                (
                    (board.getBoardWithCellValues()[1][i] === board.getBoardWithCellValues()[0][i])
                    &&
                    (board.getBoardWithCellValues()[2][i] === board.getBoardWithCellValues()[1][i])
                    &&
                    (board.getBoardWithCellValues()[2][i] === board.getBoardWithCellValues()[0][i])
                )
            ){
                board.printAnnouncement(activePlayer, 'win');
                return true;
            }
        }
        if(
            (
                (board.getBoardWithCellValues()[0][0] === board.getBoardWithCellValues()[2][2])
                &&
                (board.getBoardWithCellValues()[0][0] === board.getBoardWithCellValues()[1][1])
                &&
                (board.getBoardWithCellValues()[1][1] === board.getBoardWithCellValues()[2][2])
                &&
                (board.getBoardWithCellValues()[1][1] != '')
            )
            || 
            (
                (board.getBoardWithCellValues()[2][0] === board.getBoardWithCellValues()[1][1])
                &&
                (board.getBoardWithCellValues()[2][0] === board.getBoardWithCellValues()[0][2])
                &&
                (board.getBoardWithCellValues()[0][2] === board.getBoardWithCellValues()[1][1])
                &&
                (board.getBoardWithCellValues()[1][1] != '')
            )
        ){
            board.printAnnouncement(activePlayer, 'win');
            return true;
        }
    };

    const checkDraw = () => {
        if(board.getBoardWithCellValues().every(row => 
            row.every(cell => (cell != ''))
        )){ 
            board.printAnnouncement(activePlayer, 'draw');
            return;
        }
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (row, column) => {
        let success = board.playerTurn(row, column, activePlayer);

        if((checkDraw()) || (checkWinner())){
            board.printBoard();
            return;
        }
        else if (success){
            switchPlayerTurn();
            board.printAnnouncement(activePlayer, 'turn');
            board.printBoard();
        }
        else{
            UI.getGameAnnouncement().textContent = "The place is already taken, try again!";
        }
    };

    const bindPlayRoundEvents = () => {
        for(let row = 0;row < 3; row++){
            for(let column = 0;column < 3; column++){
                const index = row * 3 + column;
                UI.getCellBtn()[index].addEventListener('click', (event) => {
                    playRound(row, column);
                });
            }
        }
    };

    board.printAnnouncement(activePlayer, 'turn');
    bindPlayRoundEvents();

    return;
})();
