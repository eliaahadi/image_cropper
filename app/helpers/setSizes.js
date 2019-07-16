/**
 * @param {w,h,width,height} integer, integer, integer, integer
 * @returns {array of srcSize, fittedSize, scale, screenSize} all objects with integers, only scale is a integer
 */
function setSizes(w,h, width, height) {
    const screenSize = { w, h };
    const srcSize = { w: width, h: height };
    const fittedSize = { w: 0, h: 0 };
    let scale = 1.01;

  if (width < height) {
      fittedSize.h = height * w / width;
      fittedSize.w = w;
  }
  else if (width > height) {
    fittedSize.w = width * w / height;
    fittedSize.h = w;
  } 
  else if (width === height) {
    scale = 1;
    fittedSize.w = w;
    fittedSize.h = w;
  }

  return [srcSize, fittedSize, scale, screenSize ]
}

export default setSizes;
