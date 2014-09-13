var sudokuBoard = function() {
    var sudokuContainerId = "#sudoku-container"
    
    function generateBoard() {
        var sudokuBoardTemplate = $(Sudoku.templates["sudokuBoard"]());
        $(sudokuContainerId).append(sudokuBoardTemplate);
    }

    return {
        generateBoard: generateBoard
    };
}();