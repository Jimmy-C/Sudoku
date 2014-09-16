var SudokuApp = function() {
    var sudokuContainerId = "#sudoku-container";

    function createBoard() {
        var board = SudokuBoard.generateBoard();

        var instructionTemplate = $(Sudoku.templates["SudokuInstruction"]());
        $(sudokuContainerId).append(board)
            .append(instructionTemplate);
    }

    return {
        createBoard: createBoard
    };
}();