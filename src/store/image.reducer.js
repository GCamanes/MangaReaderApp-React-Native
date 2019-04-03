import {
  IMAGE_RATIO_LOADED, LOAD_IMAGE_RATIO,
} from './image.action';

export const initialState = {
  ratioLoading: true,
  ratioLoaded: false,
  url: '',
  ratio: 1,
};

export function imageReducer(state = initialState, action) {
  switch (action.type) {
    case IMAGE_RATIO_LOADED: {
      return {
        ...state,
        ratio: action.ratio,
        ratioLoading: false,
        ratioLoaded: true,
      };
    }
    case LOAD_IMAGE_RATIO: {
      return {
        ...state,
        url: action.url,
        ratioLoading: true,
        ratioLoaded: false,
      };
    }
    default:
      return state;
  }
}