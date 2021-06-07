/* eslint-disable no-restricted-properties */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
class ViewGraphics {
  constructor(ctx) {
    this.ctx = ctx;
    this.coordinatesRectangle = {}; // координаты последнего нарисованного прямоугольника
    this.LEFT = 1;
    this.RIGHT = 2;
    this.BOTTOM = 4;
    this.TOP = 8;
  }
  clear() {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.fillStyle = "#000";
  }
  DDA(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const s = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
    const xi = (dx * 1.0) / s;
    const yi = (dy * 1.0) / s;
    let x = x0;
    let y = y0;

    this.fillPixel(x0, y0);
    for (let i = 0; i < s; i++) {
      x += xi;
      y += yi;
      this.fillPixel(x, y);
    }
  }

  brezenhem(x0, y0, x1, y1) {
    let deltaX = Math.abs(x1 - x0);
    let deltaY = Math.abs(y1 - y0);
    let signX = x0 < x1 ? 1 : -1;
    let signY = y0 < y1 ? 1 : -1;
    let error = deltaX - deltaY;
    this.fillPixel(x1, y1);
    while (x0 != x1 || y0 != y1) {
      this.fillPixel(x0, y0);
      let error2 = error * 2;
      if (error2 > -deltaY) {
        error -= deltaY;
        x0 += signX;
      }
      if (error2 < deltaX) {
        error += deltaX;
        y0 += signY;
      }
    }
  }

  circleBrezenhem(x0, y0, R) {
    let x = 0;
    let y = R;
    let delta = 1 - 2 * R;
    let error = 0;
    while (y >= x) {
      this.fillPixel(x0 + x, y0 + y);
      this.fillPixel(x0 + x, y0 - y);
      this.fillPixel(x0 - x, y0 + y);
      this.fillPixel(x0 - x, y0 - y);
      this.fillPixel(x0 + y, y0 + x);
      this.fillPixel(x0 + y, y0 - x);
      this.fillPixel(x0 - y, y0 + x);
      this.fillPixel(x0 - y, y0 - x);
      error = 2 * (delta + y) - 1;
      if (delta < 0 && error <= 0) {
        delta += 2 * ++x + 1;
        continue;
      }
      if (delta > 0 && error > 0) {
        delta -= 2 * --y + 1;
        continue;
      }
      delta += 2 * (++x - --y);
    }
  }

  factorial(n) {
    // факториал
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
  }

  // вычисления полинома Бернштейна
  polBershtein(i, n, t) {
    return (
      (this.factorial(n) / (this.factorial(i) * this.factorial(n - i))) *
      Math.pow(t, i) *
      Math.pow(1 - t, n - i)
    );
  }

  bezie(Arr) {
    let j = 0;
    // Возьмем шаг 0.001 для большей точности
    const step = 0.001;

    const result = []; // Конечный массив точек кривой
    for (let t = 0; t < 1; t += step) {
      let ytmp = 0;
      let xtmp = 0;
      for (let i = 0; i < 3; i++) {
        // проходим по каждой точке
        const b = this.polBershtein(i, Arr.length - 1, t); // вычисляем полином Бернштейна для 3 точек
        xtmp += Arr[i].x * b; // записываем и прибавляем результат
        ytmp += Arr[i].y * b;
      }

      result[j] = { x: xtmp, y: ytmp };
      j++;
    }
    for (let i = 0; i < result.length; i++) {
      this.fillPixel(result[i].x, result[i].y); // Рисуем полученную кривую Безье
    }
  }

  createRectangle(x0, y0, x1, y1) {
    this.coordinatesRectangle.x0 = x0;
    this.coordinatesRectangle.y0 = y0;
    this.coordinatesRectangle.x1 = x1;
    this.coordinatesRectangle.y1 = y1;
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  }

  getCode(point) {
    let code = 0;
    if (point.x < this.coordinatesRectangle.x0) code += this.LEFT;
    if (point.x > this.coordinatesRectangle.x1) code += this.RIGHT;
    if (point.y < this.coordinatesRectangle.y0) code += this.BOTTOM;
    if (point.y > this.coordinatesRectangle.y1) code += this.TOP;
    return code;
  }

  koenSaz(x0, y0, x1, y1) {
    let sgmnt = [
      { x: x0, y: y0 },
      { x: x1, y: y1 },
    ];
    let point = {};

    let code;
    let codeA = this.getCode(sgmnt[0]);
    let codeB = this.getCode(sgmnt[1]);

    while (codeA | codeB) {
      if (codeA & codeB) return;

      if (codeA | 0) {
        code = codeA;
        point = sgmnt[0];
      } else {
        code = codeB;
        point = sgmnt[1];
      }

      if (code & this.LEFT) {
        // т.е. точка лежит слева
        point.y +=
          ((sgmnt[0].y - sgmnt[1].y) *
            (this.coordinatesRectangle.x0 - point.x)) /
          (sgmnt[0].x - sgmnt[1].x);
        point.x = this.coordinatesRectangle.x0;
      } else if (code & this.RIGHT) {
        // т.е. точка лежит сверху
        point.y +=
          ((sgmnt[0].y - sgmnt[1].y) *
            (this.coordinatesRectangle.x1 - point.x)) /
          (sgmnt[0].x - sgmnt[1].x);
        point.x = this.coordinatesRectangle.x1;
      } else if (code & this.BOTTOM) {
        // т.е. точка лежит справа
        point.x +=
          ((sgmnt[0].x - sgmnt[1].x) *
            (this.coordinatesRectangle.y0 - point.y)) /
          (sgmnt[0].y - sgmnt[1].y);
        point.y = this.coordinatesRectangle.y0;
      } else if (code & this.TOP) {
        // т.е. точка лежит снизу
        point.x +=
          ((sgmnt[0].x - sgmnt[1].x) *
            (this.coordinatesRectangle.y1 - point.y)) /
          (sgmnt[0].y - sgmnt[1].y);
        point.y = this.coordinatesRectangle.y1;
      }

      if (code === codeA) {
        sgmnt[0] = point;
        codeA = this.getCode(sgmnt[0]);
      } else {
        sgmnt[1] = point;
        codeB = this.getCode(sgmnt[1]);
      }
    }
    this.DDA(sgmnt[0].x, sgmnt[0].y, sgmnt[1].x, sgmnt[1].y);
  }

  isInside(x, y) {
    return (
      this.coordinatesRectangle.x0 <= x &&
      this.coordinatesRectangle.x1 >= x &&
      this.coordinatesRectangle.y0 <= y &&
      this.coordinatesRectangle.y1 >= y
    );
  }
  midPoint(x0, y0, x1, y1) {
    if (Math.abs(x0 - x1) <= 1 && Math.abs(y0 - y1) <= 1) return;
    if (this.isInside(x0, y0) && this.isInside(x1, y1)) {
      // если точка внутри - рисуем
      this.DDA(x0, y0, x1, y1);
      return;
    }

    let codeA = this.getCode({ x: x0, y: y0 });
    let codeB = this.getCode({ x: x1, y: y1 });
    if (codeA & codeB) return;

    this.midPoint(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
    this.midPoint((x0 + x1) / 2, (y0 + y1) / 2, x1, y1);
  }

  fillPixel(x, y) {
    this.ctx.fillRect(x, y, 1, 1);
  }
}
