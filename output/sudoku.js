'use strict';
/**
 * GuessValueWidget is a widget that shows a list of number optons for the player
 * to choose from with a semi-transparent overlay below. Only the numbers that are 
 * the initial value in the table are available for the player to choose from.
 */
var GuessValuesWidget = function() {
    var sudokuContainerId = "#sudoku-container";
    var menuClass = ".guess-values-menu";
    var menuItemClass = ".guess-value";
    var overlayClass = ".overlay";

    /**
     * Shows the widget, returns a deferred and wait for the player input.
     * The menu that contains the numbers to choose from will be located below the board.
     * Only the numbers that are not the initial values from the board will be available to
     * choose from.
     * @param {Array} - numbers that cannot be choosen.
     * @return {jQuery Deferred} - Resolves with the number choosen if the player clicks on
     *         one of the available numbers. Rejects when the player clicks on the overlay to
     *         dismiss the widget.
     */
    function show(values) {
        // To dismiss the widget.
        function overlayClickHandler(evt) {
            widgetDeferred.reject("Widget dismissed.");
            guessValueWidget.remove();
        }
        // Get the number and resolve the deferred with the number.
        function guessValueSquareClickHandler(evt) {
            var target = $(evt.target);
            var guessValue = parseInt(target.text(), 10);

            widgetDeferred.resolve(guessValue);
            guessValueWidget.remove();
        }

        var guessValueWidget = $(Sudoku.templates["GuessValuesWidget"]());
        var widgetDeferred = $.Deferred();

        guessValueWidget.find(menuClass)
            .click(guessValueSquareClickHandler)
            .find(menuItemClass).each(function(index, menuItem) {
                if (values.indexOf(index + 1) !== -1) {
                    $(menuItem).addClass('notSelectable');
                }
            });

        guessValueWidget.find(overlayClass).click(overlayClickHandler);
        $(sudokuContainerId).append(guessValueWidget);
        return widgetDeferred;
    }

    return {
        show : show
    };
}();
var SudokuApp = function() {

    function createBoard() {
        SudokuBoard.generateBoard();
    }

    return {
        createBoard: createBoard
    };
}();
var SudokuBoard = function() {
    // Cache the board for selection use later.
    var _board;

    var sudokuContainerId = "#sudoku-container";
    // Class for the initial data value.
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

    /**
     * Turns on/off the class based on the toggle value. If yes, add the class to the subsquare,
     * remove it otherwise.
     * @param subSquares {Array} - array of sub squares.
     * @param toggle {Boolean} - true then add the class to the sub squares, remove the class otherwise.
     */
    function toggleClass(subSquares, toggle) {
        var violatingRulesClass = 'violatingRules';
        subSquares.forEach(function(subSquare, index) {
            var $subSquare = $(subSquare);
            if (!$subSquare.hasClass('initialDataValue') && $subSquare.text()) {
                $(subSquare).toggleClass(violatingRulesClass, toggle);
            }
        });
    }

    /**
     * Returns true if no sub square retrieved based on the input is violating rules.
     * Check if the newly guess value is violating the game rules (having a duplicate).
     * if yes, indicate on the UI that the row, column, or sub table is violating rules.
     * @param rowColumnData {Object} - {
     *      boardColumn {String} - 1 represents the left most 3 tables, 2 represents the middle 3 tables,
     *                             3 represents the right most 3 tables.
     *      subTableColumn {String} - same as above, but choosing the columns in the sub 3x3 table.
     *      boardRow {String} - 1 represents the top most 3 tables, 2 represents the middle 3 tables,
     *                          3 represents the bottom 3 tables.
     *      subTableRow {String} - same as above, but choosing the rows in the sub 3x3 table.
     *      table {String} - the table number to select from.
     * }
     * @return {Boolean} - true if no sub square is violating reles, false otherwise.
     */
    function checkIfViolatingRules(rowColumnData) {
        var subSquaresViolatingRules = [];
        var subSquareObeyingRules = [];

        var rowSubSquares = SudokuUtils.rowSubSquaresSelector(_board, rowColumnData.boardRow, rowColumnData.subTableRow);
        if (SudokuChecker.isViolatingRules(rowSubSquares)) {
            subSquaresViolatingRules = subSquaresViolatingRules.concat(rowSubSquares);
        } else {
            subSquareObeyingRules = subSquareObeyingRules.concat(rowSubSquares);
        }

        var columnSubSquares = SudokuUtils.columnSubSquaresSelector(_board, rowColumnData.boardColumn, rowColumnData.subTableColumn);
        if (SudokuChecker.isViolatingRules(columnSubSquares)) {
            subSquaresViolatingRules = subSquaresViolatingRules.concat(columnSubSquares);
        } else {
            subSquareObeyingRules = subSquareObeyingRules.concat(columnSubSquares);
        }

        var tableSubSquares = SudokuUtils.tableSubSquaresSelector(_board, rowColumnData.table);
        if (SudokuChecker.isViolatingRules(tableSubSquares)) {
            subSquaresViolatingRules = subSquaresViolatingRules.concat(tableSubSquares);
        } else {
            subSquareObeyingRules = subSquareObeyingRules.concat(tableSubSquares);
        }

        toggleClass(subSquareObeyingRules, false);
        toggleClass(subSquaresViolatingRules, true);

        return subSquaresViolatingRules.length === 0;
    }

    /**
     * Sub square click handler. This handler finds out the row and column data about the 
     * sub square and generates the guess options for the player to guess from.
     * @param evt {jQuery Object} - jQuery event object.
     */
    function subSquareClickHandler(evt) {
        // Put the guess value into the corresponding sub square.
        // Removes the outline surrounding the selected sub square.
        function onGuessValueSelected(guessValue) {
            var hasValueChanged = guessValue !== parseInt(target.text(), 10);

            target.removeClass('selected')
                .text(guessValue)

            if (!target.hasClass('hasGuessValue')) {
                target.addClass('hasGuessValue');
            }

            if (hasValueChanged && checkIfViolatingRules(rowColumnData)) {
                if (SudokuChecker.isGameSolved(_board)) {
                    console.log("solved!");
                } else {
                    console.log("not yet");
                }
            }
        }

        // Removes the outline surrounding the selected sub square.
        function onDismissed() {
            target.removeClass('selected');
        }

        var target = $(evt.target);
        target.addClass('selected');
        var targetData = target.data();
        var targetParentData = $(target.parents('[data-table]')).data();
        var rowColumnData = $.extend({}, targetData, targetParentData);
        // Get all the values that are not available to choose from.
        var initialValues = SudokuUtils.getInitialValuesBasedOn(_board, rowColumnData);
        GuessValuesWidget.show(initialValues).then(onGuessValueSelected, onDismissed);
    }
    
    /**
     * Generates the sudoku board.
     */
    function generateBoard() {
        var sudokuBoardTemplate = $(Sudoku.templates["SudokuBoard"]());
        var boardData = SudokuBoardData.generateBoardData();

        for (var i = 1; i <= 9; i++) {
            var tableData = boardData[i-1];
            var tableTemplateConfig = {};

            for (var j = 1; j <= 9; j++) {
                tableTemplateConfig[j] = tableData[j-1] === 0 ? '' : tableData[j-1];
            }

            var tableTemplate = $(Sudoku.templates["Sudoku3x3Table"](tableTemplateConfig));
            addClassToInitialDataValue(tableTemplate, tableData);

            sudokuBoardTemplate.find('[data-table="' + i + '"]').append(tableTemplate);
        }

        // Makes the overall board the delegator of the click event inside the board.
        // Targets all the subsquares that don't have an initial value in them.
        sudokuBoardTemplate.on("click", ".sudoku-3x3-table td:not(.initialDataValue)", subSquareClickHandler);

        _board = sudokuBoardTemplate;
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
/**
 * SudokuUtils contains utility functions for the Sudoku App.
 */
var SudokuUtils = function() {

    /**
     * Returns the a column selector query that selects all the tds on boardColumn and subTableColumn.
     * @param boardColumn {String} - 1 represents the left most 3 tables, 2 represents the middle 3 tables,
     *                               3 represents the right most 3 tables.
     * @param subTableColumn {String} - same as above, but choosing the columns in the sub 3x3 table.
     * @return {String} - a selector query.
     */
    function columnValuesQueryGenerator(boardColumn, subTableColumn) {
        return 'td[data-board-column=' + boardColumn +'] td[data-sub-table-column=' + subTableColumn + ']';
    }

    /**
     * Returns the a row selector query that selects all the tds on boardRow and subTableRow.
     * @param boardRow {String} - 1 represents the top most 3 tables, 2 represents the middle 3 tables,
     *                            3 represents the bottom 3 tables.
     * @param subTableRow {String} - same as above, but choosing the rows in the sub 3x3 table.
     * @return {String} - a selector query.
     */
    function rowValuesQueryGenerator(boardRow, subTableRow) {
        return 'td[data-board-row=' + boardRow + '] td[data-sub-table-row=' + subTableRow + ']';
    }

    /**
     * Returns all the tds in the sub 3x3 table.
     * @param tableNum {String} - the table number to select from.
     * @return {String} - a selector query.
     */
    function tableValuesQueryGenerator(tableNum) {
        return 'td[data-table=' + tableNum + '] td';
    }

    /**
     * Returns all the sub squares in the given board row and sub table row in the board.
     * @param board {jQuery Object} - current state of the board.
     * @param boardRow {String} - the row number in the board, is between 1 - 3.
     * @param subTableRow {String} - the row number in the sub 3x3 table, is between 1 - 3.
     * @return {Array} - an array of sub squares.
     */
    function rowSubSquaresSelector(board, boardRow, subTableRow) {
        var query = rowValuesQueryGenerator(boardRow, subTableRow);
        return board.find(query).toArray();
    }

    /**
     * Returns all the sub squares in the given board column and sub table column in the board.
     * @param board {jQuery Object} - current state of the board.
     * @param boardRow {String} - the column number in the board, is between 1 - 3.
     * @param subTableRow {String} - the column number in the sub 3x3 table, is between 1 - 3.
     * @return {Array} - an array of sub squares.
     */
    function columnSubSquaresSelector(board, boardColumn, subTableColumn) {
        var query = columnValuesQueryGenerator(boardColumn, subTableColumn);
        return board.find(query).toArray();
    }

    /**
     * Returns all the sub squares in the given sub table number in the board.
     * @param board {jQuery Object} - current state of the board.
     * @param tableNum {String} - the table number in the board, is between 1 - 9.
     * @return {Array} - an array of sub squares.
     */
    function tableSubSquaresSelector(board, tableNum) {
        var query = tableValuesQueryGenerator(tableNum);
        return board.find(query).toArray();
    }

    /**
     * Returns the sorted unique initial values based on the board and sub table's row/column data.
     * For example, for boardColumn = 1, subTableColumn = 3, boardRow = 1, subTableRow = 1, table = 1,
     * this function would return all the unique initial values that are in row 1 of the top 3 tables,
     * column 3 of the left most 3 tables, and in table 1.
     * @param board {jQuery Object} - the sudoku board, contains all the value data.
     * @param params {Object} - {
     *      boardColumn {String} - 1 represents the left most 3 tables, 2 represents the middle 3 tables,
     *                             3 represents the right most 3 tables.
     *      subTableColumn {String} - same as above, but choosing the columns in the sub 3x3 table.
     *      boardRow {String} - 1 represents the top most 3 tables, 2 represents the middle 3 tables,
     *                          3 represents the bottom 3 tables.
     *      subTableRow {String} - same as above, but choosing the rows in the sub 3x3 table.
     *      table {String} - the table number to select from.
     * }
     * @return {Array} - sorted unique initial values.
     */
    function getInitialValuesBasedOn(board, params) {

        function getInitialValues(index, value) {
            if (value.textContent && $(value).hasClass('initialDataValue')) {
                values.push(value.textContent);
            }
        }

        var values = [];

        var columnQuery = columnValuesQueryGenerator(params.boardColumn, params.subTableColumn);
        board.find(columnQuery).each(getInitialValues);

        var rowQuery = rowValuesQueryGenerator(params.boardRow, params.subTableRow);
        board.find(rowQuery).each(getInitialValues);

        var tableQuery = tableValuesQueryGenerator(params.table);
        board.find(tableQuery).each(getInitialValues);
        
        return $.unique(values).map(function(value) {
            return parseInt(value, 10);
        }).sort();
    }

    /**
     * Public Util functions.
     */
    return {
        getInitialValuesBasedOn     : getInitialValuesBasedOn,
        rowSubSquaresSelector       : rowSubSquaresSelector,
        columnSubSquaresSelector    : columnSubSquaresSelector,
        tableSubSquaresSelector     : tableSubSquaresSelector
    };
}();