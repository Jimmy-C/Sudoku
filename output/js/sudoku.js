var SudokuApp = function() {

    function createBoard() {
        var board = SudokuBoard.generateBoard();
    }

    return {
        createBoard: createBoard
    };
}();