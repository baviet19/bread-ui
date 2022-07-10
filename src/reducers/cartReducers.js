import {
  CART_REQUEST,
  CART_SUCCESS,
  CART_FAIL,
  CART_ADD_ITEM_FAIL,
  CART_ADD_ITEM_SUCCES,
  CART_ADD_ITEM_REQUEST,
  CART_ADD_ITEM_RESET,
} from '../constants/cartConstants.js';

export const cartReducer = (state = {}, action) => {
  switch (action.type) {
    case CART_REQUEST:
      return { loading: true, ...state };
    case CART_SUCCESS:
      return { loading: false, cart: action.payload };
    case CART_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const cartCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CART_ADD_ITEM_REQUEST:
      return {
        loading: true,
      };
    case CART_ADD_ITEM_SUCCES:
      return {
        loading: false,
        success: true,
        cart: action.payload,
      };
    case CART_ADD_ITEM_FAIL:
      return {
        loading: false,
        success: false,
        error: action.payload,
      };

    case CART_ADD_ITEM_RESET:
      return {};
    default:
      return state;
  }
};
