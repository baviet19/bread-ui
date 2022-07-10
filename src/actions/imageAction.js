import {
  IMAGE_ADD_IMAGE_REQUEST,
  IMAGE_ADD_IMAGE_SUCCESS,
  IMAGE_ADD_IMAGE_FAIL,
  IMAGE_ADD_IMAGE_RESET,
} from '../constants/imageConstants.js';
import API from '../api';

export const createImage = (fmData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: IMAGE_ADD_IMAGE_REQUEST,
    });

    for (var value of fmData.values()) {
      console.log('aaaa', value);
    }

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        // 'Content-type': 'multipart/form-data',
        'content-type': 'undefined',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await API.post(`uploads`, fmData, config);

    dispatch({
      type: IMAGE_ADD_IMAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: IMAGE_ADD_IMAGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
