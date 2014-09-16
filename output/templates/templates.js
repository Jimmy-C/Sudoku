this["Sudoku"] = this["Sudoku"] || {};
this["Sudoku"]["templates"] = this["Sudoku"]["templates"] || {};

this["Sudoku"]["templates"]["GuessValuesWidget"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"guess-values-widget\">\n    <div class=\"guess-values-menu\">\n        <!-- Purposedly end the span tag in the next line to avoid unwanted gap sapce\n        between span elements -->\n        <span class=\"guess-value\">1</span\n        ><span class=\"guess-value\">2</span\n        ><span class=\"guess-value\">3</span\n        ><span class=\"guess-value\">4</span\n        ><span class=\"guess-value\">5</span\n        ><span class=\"guess-value\">6</span\n        ><span class=\"guess-value\">7</span\n        ><span class=\"guess-value\">8</span\n        ><span class=\"guess-value\">9</span>\n    </div>\n    <div class=\"overlay\"></div>\n</div>";
  });

this["Sudoku"]["templates"]["Sudoku3x3Table"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<table class=\"sudoku-3x3-table\">\n    <tr>\n        <td data-sub-table-row=\"1\" data-sub-table-column=\"1\">";
  if (helper = helpers[1]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[1]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-sub-table-row=\"1\" data-sub-table-column=\"2\">";
  if (helper = helpers[2]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[2]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-sub-table-row=\"1\" data-sub-table-column=\"3\">";
  if (helper = helpers[3]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[3]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n    </tr>\n    <tr>\n        <td data-sub-table-row=\"2\" data-sub-table-column=\"1\">";
  if (helper = helpers[4]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[4]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-sub-table-row=\"2\" data-sub-table-column=\"2\">";
  if (helper = helpers[5]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[5]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-sub-table-row=\"2\" data-sub-table-column=\"3\">";
  if (helper = helpers[6]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[6]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n    </tr>\n    <tr>\n        <td data-sub-table-row=\"3\" data-sub-table-column=\"1\">";
  if (helper = helpers[7]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[7]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-sub-table-row=\"3\" data-sub-table-column=\"2\">";
  if (helper = helpers[8]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[8]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-sub-table-row=\"3\" data-sub-table-column=\"3\">";
  if (helper = helpers[9]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[9]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n    </tr>\n</table>";
  return buffer;
  });

this["Sudoku"]["templates"]["SudokuBoard"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<table class=\"sudoku-board\">\n    <tr>\n        <td data-board-row=\"1\" data-board-column=\"1\" data-table=\"1\"></td>\n        <td data-board-row=\"1\" data-board-column=\"2\" data-table=\"2\"></td>\n        <td data-board-row=\"1\" data-board-column=\"3\" data-table=\"3\"></td>\n    </tr>\n    <tr>\n        <td data-board-row=\"2\" data-board-column=\"1\" data-table=\"4\"></td>\n        <td data-board-row=\"2\" data-board-column=\"2\" data-table=\"5\"></td>\n        <td data-board-row=\"2\" data-board-column=\"3\" data-table=\"6\"></td>\n    </tr>\n    <tr>\n        <td data-board-row=\"3\" data-board-column=\"1\" data-table=\"7\"></td>\n        <td data-board-row=\"3\" data-board-column=\"2\" data-table=\"8\"></td>\n        <td data-board-row=\"3\" data-board-column=\"3\" data-table=\"9\"></td>\n    </tr>\n</table>";
  });

this["Sudoku"]["templates"]["SudokuGameSolvedBanner"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"sudoku-game-solved-banner\">\n    <div class=\"sudoku-banner-container\">\n        <div class=\"sudoku-banner\">";
  if (helper = helpers.sudokuBannerText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sudokuBannerText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n        <div class=\"sudoku-new-game-container\">\n            <button name=\"new-game-button\" class=\"sudoku-new-game-button\">Play a new game!</button>\n        </div>\n    </div>\n    <div class=\"overlay\"></div>\n</div>";
  return buffer;
  });

this["Sudoku"]["templates"]["SudokuInstruction"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"sudoku-instruction\">\n    <p>Double click to remove your guess</p>\n</div>";
  });