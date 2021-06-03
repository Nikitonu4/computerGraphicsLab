"use strict;";

const controlPanel = document.querySelector(".control__panel");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const viewGraphics = new ViewGraphics();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let isMouseDown = false;
let Arr = [];
let startCoordinates = {
  x: 0,
  y: 0,
};

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  Arr = [];

  startCoordinates = {
    x: e.clientX,
    y: e.clientY,
  };
  Arr.push(startCoordinates);
});
canvas.addEventListener("mouseup", (e) => {
  isMouseDown = false;
  // viewGraphics.DDA(startCoordinates.x, startCoordinates.y, e.clientX, e.clientY);
  viewGraphics.brezenhem(
    startCoordinates.x,
    startCoordinates.y,
    e.clientX,
    e.clientY
  );
  console.log(startCoordinates);
  const R = Math.sqrt(
    Math.pow(e.clientX - startCoordinates.x, 2) +
      Math.pow(e.clientY - startCoordinates.y, 2)
  );

  // viewGraphics.circleBrezenhem(startCoordinates.x, startCoordinates.y, R);

  // viewGraphics.bezie();

  ctx.beginPath(); // сбрасываем path
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) Arr.push({ x: e.clientX, y: e.clientY });
});

// обработка перемещения панели управления
function dragElement(el) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;
  if (document.querySelector(`.${el.className}-header`)) {
    // если присутствует, заголовок - это место, откуда вы перемещаете DIV:
    document.querySelector(`.${el.className}-header`).onmousedown =
      dragMouseDown;
  } else {
    // в противном случае переместите DIV из любого места внутри DIV:
    el.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // получить положение курсора мыши при запуске:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // вызов функции при каждом перемещении курсора:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // вычислить новую позицию курсора:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // установите новое положение элемента:
    el.style.top = `${el.offsetTop - pos2}px`;
    el.style.left = `${el.offsetLeft - pos1}px`;
  }

  function closeDragElement() {
    // остановка перемещения при отпускании кнопки мыши:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
dragElement(controlPanel);
