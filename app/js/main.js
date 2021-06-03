"use strict;";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let viewGraphics = new ViewGraphics();
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

  const R = Math.sqrt(
    Math.pow(e.clientX - startCoordinates.x, 2) +
      Math.pow(e.clientY - startCoordinates.y, 2)
  );

  // viewGraphics.circleBrezenhem(startCoordinates.x, startCoordinates.y, R);

  // viewGraphics.bezie();

  ctx.beginPath(); // сбрасываем path
});

canvas.addEventListener("mousemove", (e) => {
  Arr.push({ x: e.clientX, y: e.clientY });
});
