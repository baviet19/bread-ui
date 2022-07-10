import {
  RATING_CREATE_RESET,
  RATING_CREATE_FAIL,
  RATING_CREATE_SUCCES,
  RATING_CREATE_REQUEST,
} from '../constants/ratingConstants.js';
import API from '../api';
export const createRating = (rate) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RATING_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await API.post(`rating`, rate, config);

    dispatch({
      type: RATING_CREATE_SUCCES,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RATING_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
