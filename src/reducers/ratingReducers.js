import {
  RATING_CREATE_RESET,
  RATING_CREATE_FAIL,
  RATING_CREATE_SUCCES,
  RATING_CREATE_REQUEST,
} from '../constants/ratingConstants.js';

export const ratingCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case RATING_CREATE_REQUEST:
      return { loading: true };
    case RATING_CREATE_SUCCES:
      return { loading: false, success: true, rate: action.payload };
    case RATING_CREATE_FAIL:
      return { loading: false, success: false, error: action.payload };
    case RATING_CREATE_RESET:
      return {};

    default:
      return state;
  }
};
