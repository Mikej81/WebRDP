/*
 * Copyright (c) 2015 Sylvain Peyrefitte
 *
 * This file is part of mstsc.js.
 *
 * mstsc.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { $, elementOffset, locale } from './mstsc.js';
import { scancode } from './keyboard.js';
import { createCanvas } from './canvas.js';

function mouseButtonMap(button) {
  switch (button) {
    case 0:
      return 1;
    case 2:
      return 2;
    default:
      return 0;
  }
}

class Client {
  constructor(canvas) {
    this.canvas = canvas;
    this.render = createCanvas(this.canvas);
    this.socket = null;
    this.activeSession = false;
    this.install();
  }

  install() {
    const self = this;

    this.canvas.addEventListener('mousemove', (e) => {
      if (!self.socket) return;
      const offset = elementOffset(self.canvas);
      self.socket.emit('mouse', e.clientX - offset.left, e.clientY - offset.top, 0, false);
      e.preventDefault();
      if (!self.activeSession) return false;
      return false;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (!self.socket) return;
      const offset = elementOffset(self.canvas);
      self.socket.emit('mouse', e.clientX - offset.left, e.clientY - offset.top, mouseButtonMap(e.button), true);
      e.preventDefault();
      return false;
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (!self.socket || !self.activeSession) return;
      const offset = elementOffset(self.canvas);
      self.socket.emit('mouse', e.clientX - offset.left, e.clientY - offset.top, mouseButtonMap(e.button), false);
      e.preventDefault();
      return false;
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      if (!self.socket || !self.activeSession) return;
      const offset = elementOffset(self.canvas);
      self.socket.emit('mouse', e.clientX - offset.left, e.clientY - offset.top, mouseButtonMap(e.button), false);
      e.preventDefault();
      return false;
    });

    // Standard wheel event (replaces deprecated DOMMouseScroll and mousewheel)
    this.canvas.addEventListener('wheel', (e) => {
      if (!self.socket || !self.activeSession) return;
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      const step = Math.round(Math.abs(delta) * 15 / 8);
      const offset = elementOffset(self.canvas);
      self.socket.emit('wheel', e.clientX - offset.left, e.clientY - offset.top, step, delta > 0, isHorizontal);
      e.preventDefault();
      return false;
    });

    window.addEventListener('keydown', (e) => {
      if (!self.socket || !self.activeSession) return;
      self.socket.emit('scancode', scancode(e), true);
      e.preventDefault();
      return false;
    });

    window.addEventListener('keyup', (e) => {
      if (!self.socket || !self.activeSession) return;
      self.socket.emit('scancode', scancode(e), false);
      e.preventDefault();
      return false;
    });

    return this;
  }

  connect(next) {
    const self = this;
    this.socket = io(window.location.protocol + '//' + window.location.host)
      .on('rdp-connect', () => {
        console.log('[WebRDP] connected');
        self.activeSession = true;
      })
      .on('rdp-bitmap', (bitmap) => {
        self.render.update(bitmap);
      })
      .on('headerBackground', (data) => {
        document.getElementById('header').style.backgroundColor = data;
      })
      .on('header', (data) => {
        document.getElementById('header').textContent = data;
      })
      .on('rdp-close', () => {
        next(null);
        console.log('[WebRDP] close');
        self.activeSession = false;
      })
      .on('rdp-error', (err) => {
        next(err);
        console.log('[WebRDP] error : ' + err.code + '(' + err.message + ')');
        self.activeSession = false;
      });

    this.socket.emit('infos', {
      screen: {
        width: this.canvas.width,
        height: this.canvas.height
      },
      locale: locale()
    });
  }
}

export function createClient(canvas) {
  return new Client(canvas);
}

// Expose to global scope for HTML inline scripts
window.WebRDP = { $, createClient };
