import { Image } from 'react-native';

export const IMAGE_RATIO_LOADED = 'IMAGE_RATIO_LOADED';
export const LOAD_IMAGE_RATIO = 'LOAD_IMAGE_RATIO';

export function imageRatioLoaded(data) {
  return {
    type: IMAGE_RATIO_LOADED,
    imgRatioHW: data.height / data.width,
    imgRatioWH: data.width / data.height,
    imgHeight: data.height,
    imgWidth: data.width,
    imgError: data.error
  };
}

export function loadImageRatio(url) {
  return (dispatch) => {
    dispatch({
      type: LOAD_IMAGE_RATIO,
      imgUrl: url,
    });
    new Promise(function (resolve, reject) {
      Image.getSize(url, (width, height) => {
        resolve({height: height, width: width});
      }, (error) => {
        reject({error: error});
      })
    })
    .then((data) => {
      dispatch(imageRatioLoaded(data))
    });
  };
}