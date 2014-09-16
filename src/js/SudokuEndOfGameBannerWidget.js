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