'use strict';
var SudokuApp = function() {

    function createBoard() {
        var board = SudokuBoard.generateBoard();
    }

    return {
        createBoard: createBoard
    };
}();
var SudokuBoard = function() {
    var sudokuContainerId = "#sudoku-container";

    // Clas for the initial data value.
    var initialDataValueClass = "initialDataValue";

    /**
     * Add a class to all the initial data values, so that we can
     * add style to them to differentiate from the guess values.
     * @param template {jQuery Object} - the 3x3 sudoku template.
     */
    function addClassToInitialDataValue(template, tableData) {
        template.find('td').each(function(index, value) {
            if (tableData[index] !== 0) {
                $(value).addClass(initialDataValueClass);
            } 
        });
    }
    
    function generateBoard() {
        var sudokuBoardTemplate = $(Sudoku.templates["sudokuBoard"]());
        var boardData = SudokuBoardData.generateBoardData();

        for (var i = 1; i <= 9; i++) {
            var tableData = boardData[i-1];
            var tableTemplateConfig = {};

            for (var j = 1; j <= 9; j++) {
                tableTemplateConfig[j] = tableData[j-1] === 0 ? '' : tableData[j-1];
            }

            var tableTemplate = $(Sudoku.templates["sudoku3x3Table"](tableTemplateConfig));
            addClassToInitialDataValue(tableTemplate, tableData);

            sudokuBoardTemplate.find('[data-table="' + i + '"]').append(tableTemplate);
        }

        $(sudokuContainerId).append(sudokuBoardTemplate);
    }

    return {
        generateBoard: generateBoard
    };
}();
/*
 * SudokuBoardData is responsible for generating the data for the
 * sudoku board. It returns a predefined set of board for now.
 * 
 * The way the board data is structured is that it returns a 2-D array.
 * Each array inside the array represents a 3x3 table within the sudoku board.
 * For example, let the first array to be [5,3,0,6,0,0,0,9,8]
 * is representing the upper left 3x3 table in the board,
 * -------
 * |5|3|0|
 * |6|0|0|
 * |0|9|8|
 * ------- 
 */
var SudokuBoardData = function() {
    var dummyData = [
        [5,3,0,6,0,0,0,9,8],
        [0,7,0,1,9,5,0,0,0],
        [0,0,0,0,0,0,0,6,0],
        [8,0,0,4,0,0,7,0,0],
        [0,6,0,8,0,3,0,2,0],
        [0,0,3,0,0,1,0,0,6],
        [0,6,0,0,0,0,0,0,0],
        [0,0,0,4,1,9,0,8,0],
        [2,8,0,0,0,5,0,7,9]
    ];

    /**
     * Generates a board and returns the representation of the board in a 2-D array.
     * @return {Array} - a 2-D array that represents the data in the sudoku board.
     */
    function generateBoardData() {
        return dummyData;
    }

    return {
        generateBoardData : generateBoardData
    }; 
}();