import Jimp from 'jimp';

let partialImage = null;
let image = null;

export function create(size) {
  return new Promise((resolve, reject) => {
    new Jimp(32, 32, (err, pImage) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      partialImage = pImage;
      new Jimp(size.width, size.height, (err2, newImage) => {
        if (err2) {
          console.error(err2);
          return reject(err2);
        }
        image = newImage;
        resolve();
      });
    });
  });
}

export function update(bitmap) {
  const output = {
    width: bitmap.width,
    height: bitmap.height,
    data: new Uint8ClampedArray(bitmap.data)
  };

  if (partialImage) {
    partialImage.bitmap.width = output.width;
    partialImage.bitmap.height = output.height;
    partialImage.bitmap.data = output.data;
    image.composite(partialImage, bitmap.destLeft, bitmap.destTop);
  }
}

export function write(filename) {
  image.write(filename);
}
