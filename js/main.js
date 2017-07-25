const NUM_ROWS = 10;
const NUM_COLS = 10;
const EMPTY = ' ';
const POINT_A = 'A';
const POINT_B = 'B';
const OBSTACLE = 'X';
let path = [];
var matrix = function(){
  let _matrix = [];
  let _unique_positions = {};

  function init() {
    _matrix = [];

    for (let i = 0; i < NUM_ROWS; i++)
    {
      _matrix[i] = [];
      for (let j = 0; j < NUM_COLS; j++)
        _matrix[i][j] = EMPTY; 
    }

    _unique_positions = {};
    _unique_positions[POINT_A] = null;
    _unique_positions[POINT_B] = null;
  }

  function getValue(row, col) {
    return _matrix[row][col];
  }

  function setValue(row, col, newValue) {
    let oldValue = getValue(row, col);
    if (newValue == POINT_A || newValue == POINT_B)
    {
      if (_unique_positions[newValue])
        setValue(_unique_positions[newValue].row, _unique_positions[newValue].col, EMPTY);
      _unique_positions[newValue] = {
        row,
        col
      }
    }
    if (_unique_positions[oldValue] && oldValue != newValue)
    {
      _unique_positions[oldValue] = null;
    }

    _matrix[row][col] = newValue;
  }

  function getPath() {
    let A = _unique_positions[POINT_A]; 
    let B = _unique_positions[POINT_B];
    const NOT_VISITED = -1;
    let distanceMatrix = [];
    let previousNode = [];

    function getNeighbors(node, checkNotVisited=true) {
      const dir_row = [-1, 0, 1, 0];
      const dir_col = [0, -1, 0, +1];
      var neighbors = [];
      for (let i = 0; i < 4; i++)
      {
        let neighbor = {
          row: node.row + dir_row[i],
          col: node.col + dir_col[i]
        };

        if (neighbor.row >= 0 && neighbor.row < NUM_ROWS && neighbor.col >= 0 && neighbor.col < NUM_COLS)
          if ((distanceMatrix[neighbor.row][neighbor.col] == NOT_VISITED || !checkNotVisited)
          && getValue(neighbor.row, neighbor.col) != OBSTACLE)
            neighbors.push(neighbor);
      }

      return neighbors;
    }
    if (!A || !B)
      throw 'Both A and B must be set';
    
    for (let row = 0; row < NUM_ROWS; row++) {
      distanceMatrix[row] = [];
      previousNode[row] = [];
      for (let col = 0; col < NUM_COLS; col++) {
        distanceMatrix[row][col] = NOT_VISITED; 
        previousNode[row][col] = null;
      }
    }
    distanceMatrix[A.row][A.col] = 0;
  
    let queue = [A];
    while (queue.length > 0) {
      let p = queue[0];
      queue.splice(0, 1);

      let neighbors = getNeighbors(p);
      neighbors.forEach(neighbor => {
        distanceMatrix[neighbor.row][neighbor.col] = distanceMatrix[p.row][p.col]+1;
        queue.push(neighbor);
        previousNode[neighbor.row][neighbor.col] = p; 
      })
    }

    if (distanceMatrix[B.row][B.col] == NOT_VISITED)
      throw 'No path from A to B';

    let path = [];
    let p = B;
    while (p != A) {
      path.splice(0, 0, p);
      p = previousNode[p.row][p.col];
    }

    path.splice(0, 0, A);

    return path;
  }

  return {
    init,
    getValue,
    setValue,
    getPath
  }
}();


function $getMazeElement()
{
  return $("#maze");
}
function $getFindPathButton()
{
  return $("#find-path");
}
function getCellID(row, col)
{
  return row*NUM_COLS+col;
}
function $getCellElement(row, col)
{
  return $('#'+getCellID(row, col));
}

function getMarkerValue()
{
  return $("input[name=marker]:checked").val();
}

function cellClickHandler(row, col)
{
  path = [];
  let value = matrix.getValue(row, col);
  let eventValue = getMarkerValue();

  if (value == eventValue)
    matrix.setValue(row, col, EMPTY);
  else
    matrix.setValue(row, col, eventValue);

  renderMatrix_First();
}

function findPathClickHandler() {
  try {
    path = matrix.getPath();
    renderMatrix_First();
  }
  catch (e) {
    alert(e);
  }
}

function getNodePathIndex(row, col) {
  for (let i = 0; i < path.length; i++)
    if (path[i].row == row && path[i].col == col)
      return i;
  return -1;
}
function renderMatrix_First()
{
  let $maze = $getMazeElement();
  $maze.empty();
  for (let row = 0; row < NUM_ROWS; row++)
  {
    $maze.append("<tr>");
    for (let col = 0; col < NUM_COLS; col++)
    {
      $maze.append("<td id="+getCellID(row, col)+"></td>");
      let $cell = $getCellElement(row, col);
      $cell.text(matrix.getValue(row, col));
      let pathIndex = getNodePathIndex(row, col);
      if (pathIndex != -1)
      {
        if (matrix.getValue(row, col) != POINT_A && matrix.getValue(row, col) != POINT_B)
        {  
          $cell.addClass('path');
          $cell.text(pathIndex);
        }
        else
        {
          $cell.addClass('path-head');
        }
      }
      else
        $cell.addClass('tile');
      $cell.click(() => {
        cellClickHandler(row, col);
      });
    }
     
    $maze.append("</tr>");
  }
}

$(document).ready(function() {

  matrix.init();
  renderMatrix_First();
  let $findPathButton = $getFindPathButton();
  $findPathButton.click(findPathClickHandler);
})