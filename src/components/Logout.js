import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';

import { logout } from '../actions/userActions.js';
const Logout = ({ match, location, history }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
    history.push('/');
  }, [dispatch]);

  return <div></div>;
};

export default Logout;
