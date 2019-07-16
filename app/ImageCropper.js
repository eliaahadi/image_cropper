import React, { PureComponent, useState, useEffect, useRef, useCallback } from 'react';
import { Image, ImageEditor, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import ImageZoom from 'react-native-image-pan-zoom';
import {setSizes} from './helpers/setSizes';

const window = Dimensions.get('window');
const w = window.width;
const h = window.height;

/**
 * @param {string, function} imageURI, mountCropperParams
 * @returns {object} cropped image
 */
function ImageCropper(props) {
  const imageZoom = useRef();
  const [state, setState] =  useState(
    {
      positionX: 0, 
      positionY: 0,
      width: 0,
      height: 0,
      minScale: 1.01,
      adjustedHeight: 0,
      loading: true
    }
  );

  /**
   * @param none
   * @returns {object} image size
   */
  useEffect(() => {
    const { imageUri } = props;
    
    /**
     * @param none
     * @returns {callback} result URL 
     */
    Image.getSize(imageUri, (width, height) => {
      const { mountCropperParams } = props;
      
      // calculate and set screen size
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

      // set state updates the screen state and applies callback of screen zoom and mounts the cropper params
      setState(
        prevState => ({
          ...prevState,
          screenSize,
          srcSize,
          fittedSize,
          minScale: scale,
          loading: false,
        }),
        () => {
          imageZoom.current.centerOn({
            x: 0,
            y: 0,
            scale,
            duration: 0,
          });
          mountCropperParams(state);
        }
      )
    })
  }, [state])
    
  /**
   * @param { positionX, positionY, scale } integer, integer, integer
   * @returns {callback} result URL 
   */
  const handleTouchMove = useCallback(({ positionX, positionY, scale }) => {
    const { mountCropperParams } = props;
    
    setState(
      prevState => ({
        ...prevState,
        positionX,
        positionY,
        scale,
      }),
      () => mountCropperParams(state),
    );
  }, [state]);

  const { loading, fittedSize, minScale } = state;
  const { imageUri, ...restProps } = props;

  const imageSrc = { uri: props.imageUri };

  return !state.loading ? (
    <ImageZoom
      ref={imageZoom}
      {...restProps}
      cropWidth={w}
      cropHeight={w}
      imageWidth={fittedSize.w}
      imageHeight={fittedSize.h}
      minScale={minScale}
      onMove={handleTouchMove}
    >
      <Image style={{ width: fittedSize.w, height: fittedSize.h }} source={imageSrc} />
    </ImageZoom>
  ) : null;
}

//setup propTypes
ImageCropper.propTypes = {
  imageUri: PropTypes.string.isRequired,
  mountCropperParams: PropTypes.func.isRequired,
}

export default ImageCropper;