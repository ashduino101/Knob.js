/**
 * Knob.js - A dead-simple JavaScript library providing a single Knob class featuring customizability and responsitivity.
 *
 * Copyright (c) 2023 Ashton Fairchild (ashduino101). Usable under the terms of the MIT License.
 **/

class Knob {
  constructor(element, diameter, color, backgroundColor = '#777777', min = 0, max = 100, value = 50) {
    this.container = element;
    this.diameter = diameter;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.min = min;
    this.max = max;

    this._lightColor = this._adjust(this.backgroundColor, 16);
    this._shadowColor = this._adjust(this.backgroundColor, -32);
    this._darkColor = this._adjust(this.backgroundColor, -48);

    this.container.classList.add('knob-container');

    this.element = document.createElement('div');
    this.element.classList.add('knob');
    this.element.style.backgroundColor = this.backgroundColor;
    this.element.style.boxShadow = `
    0 0 2px 1px ${this._lightColor} inset,
    0 0 2px 0 ${this._shadowColor}`;
    this.container.append(this.element);

    this.outline = document.createElement('div');
    this.outline.classList.add('knob-outline');
    this.outline.style.width = `${this.diameter + 4}px`;
    this.outline.style.height = `${this.diameter + 4}px`;
    this.container.append(this.outline);

    this.container.style.width = `${this.diameter}px`;
    this.container.style.height = `${this.diameter}px`;

    this.element.style.width = `${this.diameter}px`;
    this.element.style.height = `${this.diameter}px`;

    this.inner = document.createElement('div');
    this.inner.classList.add('knob-inner');
    this.inner.style.boxShadow = `0 0 2px 0 ${this.color}`
    this.element.append(this.inner);

    this.inner.style.width = `${this.diameter / 16}px`;
    this.inner.style.height = `${this.diameter / 2}px`;
    this.inner.style.backgroundColor = color;

    this.set(value);

    this.changing = false;
    this.lastY = 0;

    this.container.addEventListener('mousedown', () => {
      this.changing = true;
      this._lock();
    });

    this.container.addEventListener('mouseup', () => {
      this.changing = false;
      this._unlock();
    });

    this.container.addEventListener('wheel', e => {
      this.currentY -= e.deltaY / 10;
      this._clamp();
      this.onChange(this._knob2bounds(this.currentY));
      this._change(this.currentY);
      this._setOutline(this.currentY);
    }, {passive: true});

    document.body.addEventListener('mousemove', e => {
      if (this.changing) {
        this.currentY -= e.movementY;
        this._clamp();

        if (this.currentY !== this.lastY) {
          this.onChange(this._knob2bounds(this.currentY));
        }

        this._change(this.currentY);
        this._setOutline(this.currentY);

        this.lastY = this.currentY;
      }
    });
  }

  _adjust(color, amount) {
    return color
      .replace(/\w\w/g, m =>
        Math.min(255,
          Math.max(0, parseInt(m, 16) + amount)
        ).toString(16).padStart(2, '0')
      );
  }

  _lock() {
    try {
      this.element.requestPointerLock();
    } catch {}
  }

  _unlock() {
    try {
      document.exitPointerLock();
    } catch {}
  }

  _change(degrees) {
    this.element.style.rotate = `${degrees}deg`;
  }

  _clamp() {
    this.currentY = Math.min(Math.max(this.currentY, -150), 150);
  }

  _knob2bounds(value) {
    return ((value + 150) / 300) * (this.max - this.min) + this.min;
  }

  _bounds2knob(value) {
    return (value - this.min) / (this.max - this.min) * 300 - 150;
  }

  _setOutline(value) {
    this.outline.style.backgroundImage =
      `conic-gradient(
        from -150deg,
        ${this.color} -150deg,
        ${this.color} ${value + 150}deg,
        ${this._darkColor} ${value + 150}deg,
        ${this._darkColor} 300deg,
        #00000000 300deg,
        #00000000 360deg
      )`;
  }

  set(value) {
    let deg = this._bounds2knob(value);

    this._setOutline(deg);
    this._change(deg);

    this.currentY = deg;
  }

  onChange(value) {
    // Override with your own handler
  }
}
