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