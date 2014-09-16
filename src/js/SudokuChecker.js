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
     * Returns the array without empty values.
     * @param arr {Array} - an array of values.
     * @return {Array} - ar array of non empty values.
     */
    function getNonEmptyValuesIn(arr) {
        return arr.filter(function(value) {
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
     * Checks if the sub squares are complete and obeying rules.
     * Add the sub squares to subSquaresViolatingRules if sub squares are violating the rules or
     * add to subSquareObeyingRules otherwise.
     * Turn isGameSolved to false if either violating rules or has empty values.
     */
    function checkIfSubSquareCompleteAndObeyRules(subSquares, result) {
        if (isViolatingRules(subSquares)) {
            result.subSquaresViolatingRules = result.subSquaresViolatingRules.concat(subSquares);
            result.isGameSolved = false;
        } else {
            result.subSquareObeyingRules = result.subSquareObeyingRules.concat(subSquares);
            if (!isComplete(subSquares)) {
                result.isGameSolved = false;
            }
        }
    }

    /**
     * Returns true if the game is solved, false otherwise.
     * @param board {jQuery Object} - current state of the board.
     * @return {Boolean} - true if the game is solved, false otherwise.
     */
    function checkIfGameSolved(board) {
        var result = {
            subSquaresViolatingRules : [],
            subSquareObeyingRules    : [],
            isGameSolved : true
        };
        // Check all the board rows and columns.
        for (var i = 1; i <= 3; i++) {
            for (var j = 1; j <=3; j++) {
                var rowSubSquares = SudokuUtils.rowSubSquaresSelector(board, i, j);
                var columnSubSquares = SudokuUtils.columnSubSquaresSelector(board, i, j);
                checkIfSubSquareCompleteAndObeyRules(rowSubSquares, result);
                checkIfSubSquareCompleteAndObeyRules(columnSubSquares, result);
            }
        }

        // Check each individual table
        for (var tableNum = 1; tableNum <= 9; tableNum++) {
            var subTableSubSquares = SudokuUtils.tableSubSquaresSelector(board, tableNum);
            checkIfSubSquareCompleteAndObeyRules(subTableSubSquares, result);
        }
        return result;
    }

    /**
     * Returns true if the sub squares are complete (no empty values) and not violating rules.
     * @param subSquares {Array} - array of sub squares.
     * @return {Boolean} - Returns true if the sub squares are complete (no empty values)
     *                     and not violating rules, false otherwise.
     */
    function isComplete(subSquares) {
        var values = getValuesFromSubSquare(subSquares, true);
        return hasNoEmptyValues(values);
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
        checkIfGameSolved : checkIfGameSolved,
        isViolatingRules : isViolatingRules
    };
}();