const NUM_ROWS = 10;
const NUM_COLS = 10;
const EMPTY = ' ';
const POINT_A = 'A';
const POINT_B = 'B';
const OBSTACLE = 'X';
var matrix = [];

function initMatrix()
{
  matrix = [];

  for (let i = 0; i < NUM_ROWS; i++)
  {
    matrix[i] = [];
    for (let j = 0; j < NUM_COLS; j++)
      matrix[i][j] = EMPTY; 
  }
}

function $getMazeElement()
{
  return $("#maze");
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
  let value = matrix[row][col];
  let eventValue = getMarkerValue();

  alert(eventValue);
}
function renderMatrix()
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
      $cell.text(matrix[row][col]);
      $cell.click(() => {
        cellClickHandler(row, col);
      });
    }
     
    $maze.append("</tr>");
  }
}

$(document).ready(function() {

  initMatrix();
  renderMatrix();
})