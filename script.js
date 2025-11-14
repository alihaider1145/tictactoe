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
        else if(condition === 'initial'){
            UI.getGameAnnouncement().textContent = "Welcome to Tic Tac Toe!";
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

    const cleanBoard = () => {
        board.map((row) =>{
            row.map((cell) => {cell.setValue('')})
        });
        printBoard();
    };

    return { getBoardWithCellValues, printBoard, playerTurn, printAnnouncement, cleanBoard };
}

function Cell(){
    let value = '';

    const addTurn = (player) => {
        value = player.token;
    };

    const getValue = () => value;

    const setValue = (newValue) => {
        value = newValue;
    };

    return { addTurn, getValue, setValue };
}

function GameUI(){
    let cellBtn = [];

    cellBtn = document.querySelectorAll(".game-cell");
    const gameAnnouncement = document.querySelector(".game-announcement");
    const form = document.querySelector(".form");
    const playAgainBtn = document.querySelector(".play-again-btn");
    const gameContainer = document.querySelector(".game-container");
    const formBtn = document.querySelector(".form-btn");

    const getPlayerOneNameInput = () => new FormData(form).get("player-one-name");
    const getPlayerTwoNameInput = () => new FormData(form).get("player-two-name");
    const getForm = () => form;
    const getGameContainer = () => gameContainer;
    const getPlayAgainBtn = () => playAgainBtn;
    const getCellBtn = () => cellBtn;
    const getGameAnnouncement = () => gameAnnouncement;
    const getFormBtn = () => formBtn;

    return {   
        getCellBtn,
        getGameAnnouncement,
        getPlayerOneNameInput,
        getPlayerTwoNameInput,
        getForm,
        getGameContainer,
        getPlayAgainBtn,
        getFormBtn
    };
}

(function GameController(){
    const board = Gameboard();
    const UI = GameUI();
    let playerOneName, playerTwoName;

    const players = [
        {
            name: '',
            token: 'X',
        },
        {
            name: '',
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
            return true;
        }
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (row, column) => {
        let success = board.playerTurn(row, column, activePlayer);

        if((checkDraw()) || (checkWinner())){
            board.printBoard();
            gameOver();
        }
        else if (success){
            switchPlayerTurn();
            board.printBoard();
            board.printAnnouncement(activePlayer, 'turn');
        }
        else{
            UI.getGameAnnouncement().textContent = "The place is already taken, try again!";
        }
    };

    const bindFormEvents = () => {
        UI.getForm().addEventListener("submit", (e) => {
            e.preventDefault();

            players[0].name = playerOneName = UI.getPlayerOneNameInput();
            players[1].name = playerTwoName = UI.getPlayerTwoNameInput();

            UI.getForm().classList.add("hidden");
            UI.getGameContainer().classList.remove("hidden");

            board.printAnnouncement(activePlayer, "turn");
        });
    };

    const bindPlayAgainEvents = () => {
        UI.getPlayAgainBtn().addEventListener("click", (e) => {
            UI.getPlayAgainBtn().classList.add("hidden");
            UI.getGameContainer().classList.add("hidden");
            UI.getForm().classList.remove("hidden");

            board.cleanBoard();
            board.printAnnouncement(undefined, 'initial');
        });
    };

    const gameOver = () =>{
        UI.getPlayAgainBtn().classList.remove("hidden");
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

    bindPlayRoundEvents();
    bindFormEvents();
    bindPlayAgainEvents();

    return;
})();
