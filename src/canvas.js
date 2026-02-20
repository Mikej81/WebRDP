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

function decompress(bitmap) {
  let fName = null;
  switch (bitmap.bitsPerPixel) {
    case 15:
      fName = 'bitmap_decompress_15';
      break;
    case 16:
      fName = 'bitmap_decompress_16';
      break;
    case 24:
      fName = 'bitmap_decompress_24';
      break;
    case 32:
      fName = 'bitmap_decompress_32';
      break;
    default:
      throw new Error('invalid bitmap data format');
  }

  const input = new Uint8Array(bitmap.data);
  const inputPtr = window.Module._malloc(input.length);
  const inputHeap = new Uint8Array(window.Module.HEAPU8.buffer, inputPtr, input.length);
  inputHeap.set(input);

  const output_width = bitmap.destRight - bitmap.destLeft + 1;
  const output_height = bitmap.destBottom - bitmap.destTop + 1;
  const outputSize = output_width * output_height * 4;
  const outputPtr = window.Module._malloc(outputSize);

  const outputHeap = new Uint8Array(window.Module.HEAPU8.buffer, outputPtr, outputSize);

  window.Module.ccall(fName,
    'number',
    ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
    [outputHeap.byteOffset, output_width, output_height, bitmap.width, bitmap.height, inputHeap.byteOffset, input.length]
  );

  const output = new Uint8ClampedArray(outputHeap.buffer, outputHeap.byteOffset, outputSize);

  window.Module._free(inputPtr);
  window.Module._free(outputPtr);

  return { width: output_width, height: output_height, data: output };
}

function reverse(bitmap) {
  return { width: bitmap.width, height: bitmap.height, data: new Uint8ClampedArray(bitmap.data) };
}

export class Canvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  update(bitmap) {
    let output = null;
    if (bitmap.isCompress) {
      output = decompress(bitmap);
    } else {
      output = reverse(bitmap);
    }

    const imageData = this.ctx.createImageData(output.width, output.height);
    imageData.data.set(output.data);
    this.ctx.putImageData(imageData, bitmap.destLeft, bitmap.destTop);
  }
}

export function createCanvas(canvas) {
  return new Canvas(canvas);
}
