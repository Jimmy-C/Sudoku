var SudokuApp = function() {

    function createBoard() {
        SudokuBoard.generateBoard();
    }

    return {
        createBoard: createBoard
    };
}();