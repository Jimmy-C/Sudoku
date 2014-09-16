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