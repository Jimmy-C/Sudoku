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
     * Sub square click handler. This handler finds out the row and column data about the 
     * sub square and generates the guess options for the player to guess from.
     * @param evt {jQuery Object} - jQuery event object.
     */
    function subSquareClickHandler(evt) {
        // Put the guess value into the corresponding sub square.
        // Removes the outline surrounding the selected sub square.
        function onGuessValueSelected(guessValue) {
            target.removeClass('selected')
                .text(guessValue)

            if (!target.hasClass('hasGuessValue')) {
                target.addClass('hasGuessValue');
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

        function getValues(index, value) {
            if (value.textContent && value.className === 'initialDataValue') {
                values.push(value.textContent);
            }
        }

        var values = [];

        var columnQuery = columnValuesQueryGenerator(params.boardColumn, params.subTableColumn);
        board.find(columnQuery).each(getValues);

        var rowQuery = rowValuesQueryGenerator(params.boardRow, params.subTableRow);
        board.find(rowQuery).each(getValues);

        var tableQuery = tableValuesQueryGenerator(params.table);
        board.find(tableQuery).each(getValues);
        
        return $.unique(values).map(function(value) {
            return parseInt(value, 10);
        }).sort();
    }

    /**
     * Public Util functions.
     */
    return {
        getInitialValuesBasedOn : getInitialValuesBasedOn
    };
}();