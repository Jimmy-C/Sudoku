var sudokuApp = function() {

    function createBoard() {
        var board = sudokuBoard.generateBoard();
    }

    return {
        createBoard: createBoard
    };
}();