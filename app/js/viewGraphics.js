/* eslint-disable no-restricted-properties */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
class ViewGraphics {
  constructor(ctx) {
    this.ctx = ctx;
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
    //
    let error = deltaX - deltaY;
    //
    this.fillPixel(x1, y1);
    while (x0 != x1 || y0 != y1) {
      this.fillPixel(x0, y0);
      let error2 = error * 2;
      //
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
      // проходим по каждой точке
      for (let i = 0; i < 3; i++) {
        const b = this.polBershtein(i, Arr.length - 1, t); // вычисляем наш полином Бернштейна для 3 точек
        xtmp += Arr[i].x * b; // записываем и прибавляем результат
        ytmp += Arr[i].y * b;
      }

      result[j] = { x: xtmp, y: ytmp };
      j++;
    }
    for (let i = 0; i < result.length; i++) {
      this.fillPixel(result[i].x, result[i].y);
    } // Рисуем полученную кривую Безье
  }

  createRectangle(rectangleCoordinates) {
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeRect(
      rectangleCoordinates.x0,
      rectangleCoordinates.y0,
      rectangleCoordinates.x1 - rectangleCoordinates.x0,
      rectangleCoordinates.y1 - rectangleCoordinates.y0
    );
  }

  fillPixel(x, y) {
    this.ctx.fillRect(x, y, 1, 1);
  }
}
