"use strict;";

const controlPanel = document.querySelector(".control__panel");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const radioBox = document.querySelector(".control__panel-radiogroup");
const createRectangle = document.querySelector(".rectangle");
const createPolygon = document.querySelector(".polygon");
const clearButton = document.querySelector(".clear");
const countDots = document.querySelector(".count-dots");
const notIntEnds = document.querySelector(".notIntEnds");

let countDotsPolygon = 5;
let nowCountDotsPolygon = 0;
let arrayForPolygon = [];
let nowAlg = 1;
const viewGraphics = new ViewGraphics(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let Arr = [];
let startCoordinates = {
  x: 0,
  y: 0,
};

let countBezie = 0;

function selectAnAlgorithm() {
  nowAlg = +document.querySelector("input[name=radio-cust]:checked").value;
}
clearButton.addEventListener("click", () => {
  viewGraphics.clear();
});

createRectangle.addEventListener("click", () => {
  nowAlg = 5;
});

createPolygon.addEventListener("click", () => {
  countDotsPolygon = countDots.value;
  nowCountDotsPolygon = 0;
  nowAlg = 9;
});

radioBox.addEventListener("click", () => {
  selectAnAlgorithm();
});

notIntEnds.addEventListener("click", () => {
  viewGraphics.notIntEnds(
    document.querySelector(".startX").value,
    document.querySelector(".startY").value,
    document.querySelector(".endX").value,
    document.querySelector(".endY").value
  );
});

canvas.addEventListener("mousedown", (e) => {
  if (nowAlg == 4) {
    Arr.push({ x: e.clientX, y: e.clientY });
    countBezie++;
  }

  if (nowAlg == 9) {
    arrayForPolygon.push({ x: e.clientX, y: e.clientY });
    nowCountDotsPolygon++;
  }

  startCoordinates = {
    x: e.clientX,
    y: e.clientY,
  };
});
canvas.addEventListener("mouseup", (e) => {
  switch (nowAlg) {
    case 1:
      console.log(startCoordinates.x);
      viewGraphics.DDA(
        startCoordinates.x,
        startCoordinates.y,
        e.clientX,
        e.clientY
      );
      break;
    case 2:
      viewGraphics.brezenhem(
        startCoordinates.x,
        startCoordinates.y,
        e.clientX,
        e.clientY
      );
      break;
    case 3:
      const R = Math.sqrt(
        Math.pow(e.clientX - startCoordinates.x, 2) +
          Math.pow(e.clientY - startCoordinates.y, 2)
      );

      viewGraphics.circleBrezenhem(startCoordinates.x, startCoordinates.y, R);
      break;
    case 4:
      if (countBezie == 3) {
        viewGraphics.bezie(Arr);
        countBezie = 0;
        Arr = [];
      }
      break;
    case 5: // создаем прямоугольник для отсечения отрезков
      viewGraphics.createRectangle(
        startCoordinates.x,
        startCoordinates.y,
        e.clientX,
        e.clientY
      );
      break;
    case 6:
      viewGraphics.koenSaz(
        startCoordinates.x,
        startCoordinates.y,
        e.clientX,
        e.clientY
      );
      break;
    case 7:
      viewGraphics.midPoint(
        startCoordinates.x,
        startCoordinates.y,
        e.clientX,
        e.clientY
      );
      break;
    case 8:
      viewGraphics.cyrusBeck(
        startCoordinates.x,
        startCoordinates.y,
        e.clientX,
        e.clientY
      );
      break;
    case 9:
      if (countDotsPolygon == nowCountDotsPolygon) {
        viewGraphics.coordinatesPolygon = arrayForPolygon;
        viewGraphics.penPolygon();
        arrayForPolygon = [];
        nowCountDotsPolygon = 0;
      }
      break;
  }

  ctx.beginPath(); // сбрасываем path
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
