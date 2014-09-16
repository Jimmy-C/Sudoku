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