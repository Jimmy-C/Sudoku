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