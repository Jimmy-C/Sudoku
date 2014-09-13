this["Sudoku"] = this["Sudoku"] || {};
this["Sudoku"]["templates"] = this["Sudoku"]["templates"] || {};

this["Sudoku"]["templates"]["sudoku3x3Table"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<table class=\"sudoku-3x3-table\">\n    <tr data-row=\"1\">\n        <td data-row=\"1\" data-column=\"1\">";
  if (helper = helpers[1]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[1]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-row=\"1\" data-column=\"2\">";
  if (helper = helpers[2]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[2]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-row=\"1\" data-column=\"3\">";
  if (helper = helpers[3]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[3]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n    </tr>\n    <tr data-row=\"2\">\n        <td data-row=\"2\" data-column=\"1\">";
  if (helper = helpers[4]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[4]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-row=\"2\" data-column=\"2\">";
  if (helper = helpers[5]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[5]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-row=\"2\" data-column=\"3\">";
  if (helper = helpers[6]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[6]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n    </tr>\n    <tr data-row=\"3\">\n        <td data-row=\"3\" data-column=\"1\">";
  if (helper = helpers[7]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[7]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-row=\"3\" data-column=\"2\">";
  if (helper = helpers[8]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[8]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td data-row=\"3\" data-column=\"3\">";
  if (helper = helpers[9]) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0[9]); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n    </tr>\n</table>";
  return buffer;
  });

this["Sudoku"]["templates"]["sudokuBoard"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<table class=\"sudoku-board\">\n    <tr data-board-row=\"1\">\n        <td data-board-column=\"1\" data-table=\"1\"></td>\n        <td data-board-column=\"2\" data-table=\"2\"></td>\n        <td data-board-column=\"3\" data-table=\"3\"></td>\n    </tr>\n    <tr data-board-row=\"2\">\n        <td data-board-column=\"1\" data-table=\"4\"></td>\n        <td data-board-column=\"2\" data-table=\"5\"></td>\n        <td data-board-column=\"3\" data-table=\"6\"></td>\n    </tr>\n    <tr data-board-row=\"3\">\n        <td data-board-column=\"1\" data-table=\"7\"></td>\n        <td data-board-column=\"2\" data-table=\"8\"></td>\n        <td data-board-column=\"3\" data-table=\"9\"></td>\n    </tr>\n</table>";
  });