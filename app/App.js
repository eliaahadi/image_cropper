import React, {useState, useEffect, useCallback} from 'react';
import { Image, Button, StyleSheet, Text, View } from 'react-native';
import {crop} from './helpers/crop';
import ImageCropper from './ImageCropper';

const refIMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVUyviBEeMMFKBMlhtNs1Om3evJW4V9u1vkLxbZrVmGPbkmhnB';

  /**
   * @param none
   * @returns {object} 
   */
export default function App() {
  const [state, setState] = useState({cropperParams: {}, croppedImage: ''});

  /**
   * @param {object} cropperParams 
   * @returns {object} state
   */
  const mountCropperParams = useCallback((cropperParams) => {
    setState(prevState => ({
      ...prevState,
      cropperParams,
      })
    )
  }, [state]);

  /**
   * @param none
   * @returns {callback} result URL 
   */
   const handleClick = useCallback(async() => {
    const { cropperParams } = state;
    const cropSize = {
      width: 300,
      height: 300,
    };

    try {
      const result = await crop({
        ...cropperParams,
        imageUri: refIMAGE,
        cropSize,
      });
      setState(prevState => ({
        ...prevState,
        croppedImage: result,
      }));
    } 
    catch (error) {
      alert(error)
    }
  }, [state])

  const { croppedImage } = state;
  
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: 'bold', lineHeight: 20, textShadowRadius: 20, textAlignVertical: 'center', textAlign: 'center'}}>Image Cropper App</Text>
      <ImageCropper imageUri={refIMAGE} mountCropperParams={mountCropperParams} />
        <Button onPress={handleClick} title="Crop Image" color="red" accessibilityLabel="Crop image"/>
         {croppedImage ? (
          <Image style={{alignSelf: 'center', width: 200, height: 200 }} source={{ uri: croppedImage }} />
        ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
