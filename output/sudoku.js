'use strict';
var sudokuApp = function() {

    function createBoard() {
        var board = sudokuBoard.generateBoard();
    }

    return {
        createBoard: createBoard
    };
}();
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