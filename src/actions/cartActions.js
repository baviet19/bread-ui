import {
  CART_REQUEST,
  CART_SUCCESS,
  CART_FAIL,
  CART_RESET,
  CART_ADD_ITEM,
  CART_ADD_ITEM_FAIL,
  CART_ADD_ITEM_SUCCES,
  CART_ADD_ITEM_REQUEST,
} from '../constants/cartConstants.js';

import API from '../api';

export const userCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_REQUEST });

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

    // headers.append('Access-Control-Allow-Origin', 'http://localhost:3002');
    // headers.append('Access-Control-Allow-Credentials', 'true');

    const { data } = await API.get('customers/cart', config);
    //console.log(data);

    dispatch({
      type: CART_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CART_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const cartFood = {
      id: Number(id),
      amount: qty,
    };

    dispatch({
      type: CART_ADD_ITEM_REQUEST,
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

    const { data } = await API.post(`customers/cart`, cartFood, config);

    dispatch({
      type: CART_ADD_ITEM_SUCCES,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
