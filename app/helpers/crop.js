import { ImageEditor } from 'react-native';

const percentNumber = (percent, number) => (number / 100) * percent;

const percentDifference = (number, numberFrom) => (number / numberFrom) * 100;

/**
 * @param {object} params 
 * @returns {promise} successful cropped image
 */
export const crop = (params) => {
  const {
    imageUri,
    cropSize,
    positionX,
    positionY,
    screenSize,
    srcSize,
    fittedSize,
    scale,
  } = params;

  const offset = { x: 0, y: 0 };

  const widthScale = screenSize.w / scale;
  const percentCropWidth = percentDifference(widthScale, fittedSize.w);
  const hiddenWidth = percentNumber(100 - percentCropWidth, fittedSize.w);

  const percentCropHeight = percentDifference(widthScale, fittedSize.h);
  const hiddenHeight = percentNumber(100 - percentCropHeight, fittedSize.h);

  const x = (hiddenWidth / 2) - positionX;
  const y = (hiddenHeight / 2) - positionY;

  if (x <= 0) {
    offset.x = 0;
  } else {
    offset.x = x;
  }
  
  if (y <= 0) {
    offset.y = 0;
  } else {
    offset.y = y;
  }

  const srcPercentCropWidth = percentDifference(offset.x, fittedSize.w);
  const srcPercentCropHeight = percentDifference(offset.y, fittedSize.h);

  const offsetWidth = percentNumber(srcPercentCropWidth, srcSize.w);
  const offsetHeight = percentNumber(srcPercentCropHeight, srcSize.h);

  const sizeWidth = percentNumber(percentCropWidth, srcSize.w);
  const sizeHeight = percentNumber(percentCropHeight, srcSize.h);

  offset.x = offsetWidth;
  offset.y = offsetHeight;

  const cropData = {
    offset,
    size: {
      width: sizeWidth,
      height: sizeHeight,
    },
    displaySize: {
      width: cropSize.width,
      height: cropSize.height,
    },
  };

  return new Promise((resolve, reject) =>
    ImageEditor.cropImage(imageUri, cropData, resolve, reject),
  );
};