import {
  IMAGE_RATIO_LOADED, LOAD_IMAGE_RATIO,
} from './image.action';

export const initialState = {
  imgRatioLoading: true,
  imgUrl: '',
  imgRatioWH: 1,
  imgRatioHW: 1,
  imgHeight: 150,
  imgWidth: 100,
  imgError: undefined
};

export function imageReducer(state = initialState, action) {
  switch (action.type) {
    case IMAGE_RATIO_LOADED: {
      return {
        ...state,
        imgRatioHW: action.imgRatioHW,
        imgRatioWH: action.imgRatioWH,
        imgHeight: action.imgHeight,
        imgWidth: action.imgWidth,
        imgRatioLoading: false,
        imgError: action.imgError
      };
    }
    case LOAD_IMAGE_RATIO: {
      return {
        ...state,
        imgUrl: action.imgUrl,
        imgRatioLoading: true,
      };
    }
    default:
      return state;
  }
}