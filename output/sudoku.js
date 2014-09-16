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

    var _GuessValuesWidgetPubSub = null;

    var Public_Events = {
        Guess_value : "guess_value",
        Dismissed   : "dismissed"
    }

    /**
     * Let other modules to subscribe to this module's event;
     */
    function subscribeEvent(name, callback) {
        _GuessValuesWidgetPubSub.subscribe(name, callback);
    }

    /**
     * Let other modules to unsubscribe to this module's event;
     */
    function unsubscribeEvent(name) {
        _GuessValuesWidgetPubSub.unsubscribe(name);
    }

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
            guessValueWidget.remove();
            _GuessValuesWidgetPubSub.publish(Public_Events.Dismissed);
        }
        // Get the number and resolve the deferred with the number.
        function guessValueSquareClickHandler(evt) {
            var target = $(evt.target);
            var guessValue = parseInt(target.text(), 10);
            guessValueWidget.remove();
            _GuessValuesWidgetPubSub.publish(Public_Events.Guess_value, guessValue);
        }

        _GuessValuesWidgetPubSub = new PubSub();
        var guessValueWidget = $(Sudoku.templates["GuessValuesWidget"]());

        guessValueWidget.find(menuClass)
            .on("click", ".guess-value:not(.notSelectable)", guessValueSquareClickHandler)
            .find(menuItemClass).each(function(index, menuItem) {
                if (values.indexOf(index + 1) !== -1) {
                    $(menuItem).addClass('notSelectable');
                }
            });

        guessValueWidget.find(overlayClass).click(overlayClickHandler);
        $(sudokuContainerId).append(guessValueWidget);
    }

    return {
        show : show,
        subscribeEvent : subscribeEvent,
        unsubscribeEvent : unsubscribeEvent,
        Public_Events  : Public_Events
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
     * Returns an array containing all the values in the sub-squares.
     * @param subSquares {Array} - sub-squares in the Sudoku board.
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
     * Checks if the sub-squares are complete and obeying rules.
     * Add the sub-squares to subSquaresViolatingRules if sub-squares are violating the rules or
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
     * Returns true if the sub-squares are complete (no empty values) and not violating rules.
     * @param subSquares {Array} - array of sub-squares.
     * @return {Boolean} - Returns true if the sub-squares are complete (no empty values)
     *                     and not violating rules, false otherwise.
     */
    function isComplete(subSquares) {
        var values = getValuesFromSubSquare(subSquares, true);
        return hasNoEmptyValues(values);
    }

    /**
     * Returns true if at least one value in the sub-squares is duplicated (violating the game rules).
     * This function can be used to check for rows, columns, and sub 3x3 tables.
     * @param subSquares {Array} - sub-squares in the Sudoku board.
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
/**
 * SudokuEndOfGameBannerWidget is responsible for showing the game solved banner,
 * signals the app the generate a new board if the player elects to.
 */
var SudokuEndOfGameBannerWidget = function() {
    var _SudokuEndOfGameBannerPubSub = null;
    var _sudokuEndOfGameBannerWidget;

    var Public_Events = {
        New_game : "new_game"
    }

    /**
     * Pick a random text to display in the banner.
     */
    function sudokuGameSolvedBannerTextGenerator() {
        var textStrings = ["Congratulation!", "Well done!", "You're awesome!"];
        var randomIndex = Math.floor(Math.random() * (textStrings.length - 0));
        return textStrings[randomIndex];
    }

    /**
     * Signals the app to generate a new board.
     */
    function newGameClickHandler(evt) {
        _sudokuEndOfGameBannerWidget.remove();
        _SudokuEndOfGameBannerPubSub.publish(Public_Events.New_game);
    }

    /**
     * Let other modules to subscribe to this module's event;
     */
    function subscribeEvent(name, callback) {
        _SudokuEndOfGameBannerPubSub.subscribe(name, callback);
    }

    /**
     * Let other modules to unsubscribe to this module's event;
     */
    function unsubscribeEvent(name) {
        _SudokuEndOfGameBannerPubSub.unsubscribe(name);
    }

    /**
     * Shows the banner.
     */
    function showBanner() {
        _SudokuEndOfGameBannerPubSub = new PubSub();
        var config = {
            sudokuBannerText : sudokuGameSolvedBannerTextGenerator()
        };
        _sudokuEndOfGameBannerWidget = $(Sudoku.templates["SudokuGameSolvedBanner"](config));
        _sudokuEndOfGameBannerWidget.find('.sudoku-new-game-button').click(newGameClickHandler);
        $('body').append(_sudokuEndOfGameBannerWidget);
        
        // Because the height of the banner is based on the height of the screen, we need to wait
        // until the height is determined to set the line-height;
        var bannerContainerHeight = $(".sudoku-banner-container").height();
        $(".sudoku-banner").css('line-height', bannerContainerHeight + "px");
    }

    return {
        showBanner : showBanner,
        subscribeEvent : subscribeEvent,
        unsubscribeEvent: unsubscribeEvent,
        Public_Events: Public_Events
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
     * Returns all the sub-squares in the given board row and sub table row in the board.
     * @param board {jQuery Object} - current state of the board.
     * @param boardRow {String} - the row number in the board, is between 1 - 3.
     * @param subTableRow {String} - the row number in the sub 3x3 table, is between 1 - 3.
     * @return {Array} - an array of sub-squares.
     */
    function rowSubSquaresSelector(board, boardRow, subTableRow) {
        var query = rowValuesQueryGenerator(boardRow, subTableRow);
        return board.find(query).toArray();
    }

    /**
     * Returns all the sub-squares in the given board column and sub table column in the board.
     * @param board {jQuery Object} - current state of the board.
     * @param boardRow {String} - the column number in the board, is between 1 - 3.
     * @param subTableRow {String} - the column number in the sub 3x3 table, is between 1 - 3.
     * @return {Array} - an array of sub-squares.
     */
    function columnSubSquaresSelector(board, boardColumn, subTableColumn) {
        var query = columnValuesQueryGenerator(boardColumn, subTableColumn);
        return board.find(query).toArray();
    }

    /**
     * Returns all the sub-squares in the given sub table number in the board.
     * @param board {jQuery Object} - current state of the board.
     * @param tableNum {String} - the table number in the board, is between 1 - 9.
     * @return {Array} - an array of sub-squares.
     */
    function tableSubSquaresSelector(board, tableNum) {
        var query = tableValuesQueryGenerator(tableNum);
        return board.find(query).toArray();
    }

    function geRowColumnDataBasedOn(target) {
        var subSquare = $(target);
        var subSquareData = subSquare.data();
        var subSquareParentData = $(subSquare.parents('[data-table]')).data();
        var rowColumnData = $.extend({}, subSquareData, subSquareParentData);
        return rowColumnData;
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
        geRowColumnDataBasedOn      : geRowColumnDataBasedOn,
        rowSubSquaresSelector       : rowSubSquaresSelector,
        columnSubSquaresSelector    : columnSubSquaresSelector,
        tableSubSquaresSelector     : tableSubSquaresSelector
    };
}();
var SudokuApp = function() {
    var sudokuContainerId = "#sudoku-container";

    /**
     * Shows the game solved banner. Set up a new game if the player elects to.
     */
    function gameSolvedHandler() {
        SudokuEndOfGameBannerWidget.showBanner();
        SudokuEndOfGameBannerWidget.subscribeEvent(SudokuEndOfGameBannerWidget.Public_Events.New_game, newGameHandler);
    } 

    /**
     * new game handler. Sets up a new board.
     */
    function newGameHandler() {
        SudokuBoard.destroy();
        $(sudokuContainerId).empty();
        createBoard();
    }

    /**
     * Creates a sudoku board with a instruction underneath.
     */
    function createBoard() {
        var board = SudokuBoard.generateBoard();
        SudokuBoard.subscribeEvent(SudokuBoard.Public_Events.Game_solved, gameSolvedHandler);

        var instructionTemplate = $(Sudoku.templates["SudokuInstruction"]());
        $(sudokuContainerId).append(board)
            .append(instructionTemplate);
    }

    return {
        createBoard: createBoard
    };
}();
var SudokuBoard = function() {
    // Cache the board for selection use later.
    var _board = null;

    // Class for the initial data value.
    var initialDataValueClass = "initialDataValue";

    // variables needed to distinguish between single click and double clicks.
    var _click = 0;
    var DELAY = 180;
    var _timer = null;

    var _SudokuBoardPubSub = null;
    var Public_Events = {
        Game_solved : "game_solved"
    }

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
     * @param subSquares {Array} - array of sub-squares.
     * @param toggle {Boolean} - true then add the class to the sub-squares, remove the class otherwise.
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
     * Sub-square single click handler. This handler finds out the row and column data about the 
     * sub-square and shows the guess value widget for the player to pick a number. If the guess
     * value violates the rules, the affected row/column/subtable's values will change.
     * @param evt {jQuery Object} - jQuery event object.
     */
    function subSquareSingleClickHandler(evt) {
        // Put the guess value into the corresponding sub-square.
        // Removes the outline surrounding the selected sub-square.
        function onGuessValueSelected(guessValue) {
            var hasValueChanged = guessValue !== parseInt(target.text(), 10);

            target.removeClass('selected')
                .text(guessValue);

            target.addClass('hasGuessValue');

            if (hasValueChanged) {
                var results = SudokuChecker.checkIfGameSolved(_board);
                toggleClass(results.subSquareObeyingRules, false);
                toggleClass(results.subSquaresViolatingRules, true);
                
                if (true || results.isGameSolved) {
                    _SudokuBoardPubSub.publish(Public_Events.Game_solved);
                }
            }
        }

        // Removes the outline surrounding the selected sub-square.
        function onDismissed() {
            target.removeClass('selected');
        }

        var target = $(evt.target);
        target.addClass('selected');
        var rowColumnData = SudokuUtils.geRowColumnDataBasedOn(target);
        // Get all the values that are not available to choose from.
        var initialValues = SudokuUtils.getInitialValuesBasedOn(_board, rowColumnData);
        GuessValuesWidget.show(initialValues);
        GuessValuesWidget.subscribeEvent(GuessValuesWidget.Public_Events.Dismissed, onDismissed);
        GuessValuesWidget.subscribeEvent(GuessValuesWidget.Public_Events.Guess_value, onGuessValueSelected);
    }

    /**
     * Sub-square double click handler. If the sub-square getting clicked on has
     * a value, the value will get removed.
     * @param evt {jQuery Object} - jQuery event object.
     */    
    function subSquareDoubleClickHandler(evt) {
        var target = $(evt.target);
        var targetValue = target.text();
        if (targetValue) {
            target.text('');
            target.removeClass('hasGuessValue');
            var results = SudokuChecker.checkIfGameSolved(_board);
            toggleClass(results.subSquareObeyingRules, false);
            toggleClass(results.subSquaresViolatingRules, true);
        }
    }

    /**
     * Handler for the click event. Set a timer with delay, if the player triggers a click
     * event before the delay ends, fires a double click event handler, otherwise fires the
     * single click event handler. 
     */
    function subSquareClickHandler(evt) {
        _click++;

        if (_click === 1) {
            _timer = setTimeout(function() {
                subSquareSingleClickHandler(evt);
                _click = 0;
            }, DELAY);
        } else {
            clearTimeout(_timer);
            subSquareDoubleClickHandler(evt);
            _click = 0;
        }
    }

    /**
     * Let other modules to subscribe to this module's event;
     */
    function subscribeEvent(name, callback) {
        _SudokuBoardPubSub.subscribe(name, callback);
    }

    /**
     * Let other modules to unsubscribe to this module's event;
     */
    function unsubscribeEvent(name) {
        _SudokuBoardPubSub.unsubscribe(name);
    }

    /**
     * Cleans up the current board.
     */
    function destroy() {
        _board = null;
        _SudokuBoardPubSub = null;
    }
    
    /**
     * Generates the sudoku board and returns the board.
     * @return {jQuery Object} - the representation of the board.
     */
    function generateBoard() {
        _SudokuBoardPubSub = new PubSub();
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
        return sudokuBoardTemplate;
    }

    return {
        generateBoard : generateBoard,
        destroy       : destroy,
        subscribeEvent : subscribeEvent,
        Public_Events  : Public_Events,
        unsubscribeEvent : unsubscribeEvent
    };
}();