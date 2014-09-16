var SudokuBoard = function() {
    // Cache the board for selection use later.
    var _board;

    var sudokuContainerId = "#sudoku-container";
    // Class for the initial data value.
    var initialDataValueClass = "initialDataValue";

    // variables needed to distinguish between single click and double clicks.
    var _click = 0;
    var DELAY = 180;
    var _timer = null;

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
     * Sub square single click handler. This handler finds out the row and column data about the 
     * sub square and shows the guess value widget for the player to pick a number. If the guess
     * value violates the rules, the affected row/column/subtable's values will change.
     * @param evt {jQuery Object} - jQuery event object.
     */
    function subSquareSingleClickHandler(evt) {
        // Put the guess value into the corresponding sub square.
        // Removes the outline surrounding the selected sub square.
        function onGuessValueSelected(guessValue) {
            var hasValueChanged = guessValue !== parseInt(target.text(), 10);

            target.removeClass('selected')
                .text(guessValue);

            target.addClass('hasGuessValue');

            if (hasValueChanged) {
                var results = SudokuChecker.checkIfGameSolved(_board);
                toggleClass(results.subSquareObeyingRules, false);
                toggleClass(results.subSquaresViolatingRules, true);
                
                if (results.isGameSolved) {
                    //TODO Implement end of game celebration.
                }
            }
        }

        // Removes the outline surrounding the selected sub square.
        function onDismissed() {
            target.removeClass('selected');
        }

        var target = $(evt.target);
        target.addClass('selected');
        var rowColumnData = SudokuUtils.geRowColumnDataBasedOn(target);
        // Get all the values that are not available to choose from.
        var initialValues = SudokuUtils.getInitialValuesBasedOn(_board, rowColumnData);
        GuessValuesWidget.show(initialValues).then(onGuessValueSelected, onDismissed);
    }

    /**
     * Sub square double click handler. If the sub square getting clicked on has
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