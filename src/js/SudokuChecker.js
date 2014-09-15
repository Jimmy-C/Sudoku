/**
 * SudokuChecker is responsible for checking if the game is solved or check if some guess values
 * are violating the rules.
 */
var SudokuChecker = function() {

    /**
     * Returns true if all the values in the array are unique.
     * @param arr {Array} - an array containing values.
     * @return {Boolean} - true if all the values in the array are unique, false otherwise.
     */
    function hasOnlyUniqueValues(arr) {
        return arr.every(function(value, index) {
            return index === arr.indexOf(value);
        }); 
    }

    /**
     * Returns true if the arr does not have empty values, false otherwise.
     * @param arr {Array} - array of values.
     * @return {Boolean} - returns true if the array does not contain empty values,
     *                     false otherwise.
     */
    function hasNoEmptyValues(arr) {
        return arr.every(function(value, index) {
            return !!value;
        });
    }

    /**
     * Returns an array containing all the values in the sub squares.
     * @param subSquares {Array} - sub squares in the Sudoku board.
     * @param includeEmpty {Boolean} - true if empty values should be considered as well.
     * @return {Array} - an array of values.
     */
    function getValuesFromSubSquare(subSquares, includeEmpty) {
        var values = [];
        subSquares.forEach(function(subSquare) {
            if (subSquare.textContent || includeEmpty) {
                values.push(subSquare.textContent);
            }
        });
        return values;
    }

    /**
     * Returns true if the game is solved, false otherwise.
     * @param board {jQuery Object} - current state of the board.
     * @return {Boolean} - true if the game is solved, false otherwise.
     */
    function isGameSolved(board) {
        // Check all the board rows and columns.
        for (var i = 1; i <= 3; i++) {
            for (var j = 1; j <=3; j++) {
                var rowSubSquares = SudokuUtils.rowSubSquaresSelector(board, i, j);
                var columnSubSquares = SudokuUtils.columnSubSquaresSelector(board, i, j);
                if (!isCompleteAndNotViolatingRules(rowSubSquares) || !isCompleteAndNotViolatingRules(columnSubSquares)) {
                    return false;
                }
            }
        }

        // Check each individual table
        for (var tableNum = 1; tableNum <= 9; tableNum++) {
            var subTableSubSquares = SudokuUtils.tableSubSquaresSelector(board, tableNum);
            if (!isCompleteAndNotViolatingRules(subTableSubSquares)){
                return false;
            }
        }
        return true;
    }

    /**
     * Returns true if the sub squares are complete (no empty values) and not violating rules.
     * @param subSquares {Array} - array of sub squares.
     * @return {Boolean} - Returns true if the sub squares are complete (no empty values)
     *                     and not violating rules, false otherwise.
     */
    function isCompleteAndNotViolatingRules(subSquares) {
        var values = getValuesFromSubSquare(subSquares, true);
        return hasNoEmptyValues(values) && hasOnlyUniqueValues(values);
    }

    /**
     * Returns true if at least one value in the sub squares is duplicated (violating the game rules).
     * This function can be used to check for rows, columns, and sub 3x3 tables.
     * @param subSquares {Array} - sub squares in the Sudoku board.
     * @return {Boolean} - true if all the values in the array are unique, false otherwise.
     */
    function isViolatingRules(subSquares) {
        var values = getValuesFromSubSquare(subSquares);
        return !hasOnlyUniqueValues(values);
    }

    return {
        isGameSolved : isGameSolved,
        isViolatingRules : isViolatingRules
    };
}();