const Jimp = require('jimp');

let partialImage = null;
let image = null;

/**
 * create the canvas to right the screen updates to
 * @param size {object} - object with height and width of the screen
 */
function create(size) {
  return new Promise((resolve, reject) => {
    new Jimp(32,32, function(err, pImage) {
      partialImage = pImage;
      if(err) {
        console.error(err);
        reject(err);
      } else {
        new Jimp(size.width, size.height, function(err2, newImage) {
          image = newImage;
          if(err) {
            console.error(err2);
            reject(err2);
          } else {
            resolve();
          }
        });
      }
    });
  });
};
/**
 * update canvas with new bitmap
 * @param bitmap {object}
 */
function update (bitmap) {
  var output = {
    width: bitmap.width,
    height: bitmap.height,
    data: new Uint8ClampedArray(bitmap.data)
  };

  if(partialImage) {
    partialImage.bitmap.width = output.width;
    partialImage.bitmap.height = output.height;
    partialImage.bitmap.data = output.data;
    image.composite(partialImage, bitmap.destLeft, bitmap.destTop);
  }
}

/**
 * write the current image to disk
 * @param filename - file name to write to
 */
function write (filename) {
  image.write(filename);
}

module.exports = {
  create,
  update,
  write
};
