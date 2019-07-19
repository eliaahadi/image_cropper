import React, { Component, useState, useEffect, useRef, useCallback } from 'react';
import { Image, ImageEditor, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import ImageZoom from 'react-native-image-pan-zoom';
import setSizes from './helpers/setSizes';

const window = Dimensions.get('window');
const w = window.width;
const h = window.height;

/**
 * @param {string, function} imageURI, mountCropperParams
 * @returns {object} cropped image
 */
class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.imageZoom = React.createRef();
    this.state = {
      positionX: 0,
      positionY: 0,
      width: 0,
      height: 0,
      minScale: 1.01,
      adjustedHeight: 0,
      loading: true,
    };
  }

  static propTypes = {
    imageUri: PropTypes.string.isRequired,
    mountCropperParams: PropTypes.func.isRequired,
  };

  /**
   * @param none
   * @returns {object} image size
   */
  componentDidMount() {
    const { imageUri } = this.props;

    /**
     * @param none
     * @returns {callback} result URL 
     */
    Image.getSize(imageUri, (width, height) => {
      const { mountCropperParams } = this.props;
      var [srcSize, fittedSize, scale, screenSize] = setSizes(w, h, width, height);
      
      // set state updates the screen state and applies callback of screen zoom and mounts the cropper params
      this.setState(
        prevState => ({
          ...prevState,
          screenSize,
          srcSize,
          fittedSize,
          minScale: scale,
          loading: false,
        }),
        () => {
          this.imageZoom.current.centerOn({
            x: 0,
            y: 0,
            scale,
            duration: 0,
          });
          mountCropperParams(this.state);
        },
      );
    });
  }

  /**
   * @param { positionX, positionY, scale } integer, integer, integer
   * @returns {callback} result URL 
   */
  handleTouchMove = ({ positionX, positionY, scale }) => {
    const { mountCropperParams } = this.props;

    // set state updates the screen state and applies callback to mount the cropper params
    this.setState(
      prevState => ({
        ...prevState,
        positionX,
        positionY,
        scale,
      }),
      () => mountCropperParams(this.state),
    );
  };

  render() {
    const { imageUri, ...Props } = this.props;
    const imageSrc = { uri: imageUri };
    const { loading, fittedSize, minScale } = this.state;

    return !this.state.loading ? (
      <ImageZoom
        ref={this.imageZoom}
        {...Props}
        cropWidth={w}
        cropHeight={w}
        imageWidth={fittedSize.w}
        imageHeight={fittedSize.h}
        minScale={minScale}
        onMove={this.handleTouchMove}
      >
        <Image style={{ width: fittedSize.w, height: fittedSize.h }} source={imageSrc} />
      </ImageZoom>
    ) : null;
  }
}

export default ImageCropper;

