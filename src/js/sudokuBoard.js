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