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