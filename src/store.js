import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {
  productListReducer,
  productDetailsReducer,
  productUpdateReducer,
  productDeleteReducer,
  productCreateReducer,
} from './reducers/productReducers.js';

import {
  categoryListReducer,
  categoryDetailsReducer,
  categoryUpdateReducer,
  categoryCreateReducer,
  categoryDeleteReducer,
} from './reducers/categoryReducers.js';

import { cartReducer, cartCreateReducer } from './reducers/cartReducers.js';
import {
  userLoginReducer,
  userListReducer,
  userDetailsReducer,
  userUpdateReducer,
  userListDetailReducer,
  userCreateReducer,
  userDeleteReducer,
  userDetailUpdateReducer,
  userDetailCreateReducer,
} from './reducers/userReducers.js';

import { imageCreateReducer } from './reducers/imageReducer.js';

import {
  orderMyListReducer,
  orderDetailsReducer,
  orderListReducer,
  orderCreateReducer,
  orderUpdateReducer,
} from './reducers/orderReducers.js';

import { ratingCreateReducer } from './reducers/ratingReducers';

const reducer = combineReducers({
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categoryCreate: categoryCreateReducer,
  categoryUpdate: categoryUpdateReducer,
  categoryDelete: categoryDeleteReducer,

  productList: productListReducer,
  productDetails: productDetailsReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,

  cart: cartReducer,
  cartCreate: cartCreateReducer,

  userLogin: userLoginReducer,
  userList: userListReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userDetailList: userListDetailReducer,
  userCreate: userCreateReducer,
  userDelete: userDeleteReducer,
  userDetailUpdate: userDetailUpdateReducer,
  userDetailCreate: userDetailCreateReducer,

  orderMyList: orderMyListReducer,
  orderDetails: orderDetailsReducer,
  orderList: orderListReducer,
  orderCreate: orderCreateReducer,
  orderUpdate: orderUpdateReducer,

  imageCreate: imageCreateReducer,

  ratingCreate: ratingCreateReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  productList: {
    loading: true,
  },

  // productDetails: {
  //   loading: true,
  // },

  cart: {
    loading: true,
  },
  userLogin: {
    loading: false,
    userInfo: userInfoFromStorage,
  },

  orderMyList: {
    loading: true,
  },

  orderDetails: {
    loading: true,
  },
  userDetailList: {
    loading: true,
  },
  orderCreate: {
    loading: true,
  },

  cartCreate: {
    loading: true,
  },

  imageCreate: {
    loading: true,
  },
  // categoryDelete: {
  //   loading: true,
  // },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
