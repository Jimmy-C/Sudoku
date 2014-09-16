This is a web based sudoku game written in HTML5, CSS3, and JavaScript developed by Jimmy-C.

The structure of the application:
    - SudokuApp : the center piece of the app, holding all the pieces together.
        * SudokuBoard : Responsible for creating the view of the board and handle events inside the board.
        * SudokuBoardData : Responsible for generating the initial board values. The values are hardcoded for now.
        * SudokuChecker : Responsible for checking if the board is solved, if not, figures out what sub squares are violating the rules.
        * GuessValuesWidget : A UI widget for the player to pick a number.
        * SudokuEndOfGameBannerWidget : An acorss the monitor widget congratulating the player for beating the game, also asks if the player wants to play a new game.
        * SudokuUtils : Several util functions for retriving the data values in the board.

Technologies used:
    - Handlebars : The templating library for generating reusable html templates. The reason behind choosing Handlebars was because this is the templating library that I'm most familiar with and is simple but powerful enough to serve the need of this application.
    - SASS       : CSS precompilation library. The reason behind using SASS was because I'm more familiar with SASS than LESS and SASS has slightly more features (Compass library!) that might be useful in the future.
    - Grunt      : Code compilation. Good community support and easy to use.
    - jQuery     : Has a lot of convinient functions and handles the cross-browser issue.
    - Pubsub     : An implementation of the design pattern for event publishing and receiving. A great way to make sure the modules are decoupled.

Had I had additional time I would:
    - Build a double tap event handler for mobile devices, so that the player can double tap to remove their guess number.
    - Clean up the grunt file a little bit to reduce redunency.
    - Have more than just one board.