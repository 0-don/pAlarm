import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

export const register =
  ({ name, email, key, password }) =>
  async (dispatch) => {
    const body = JSON.stringify({ name, email, key, password });

    try {
      const res = await axios.post('/api/users', body);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors)
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));

      dispatch({ type: REGISTER_FAIL });
    }
  };

//Login User
export const login = (email, password) => async (dispatch) => {
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors)
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    dispatch({ type: LOGIN_FAIL });
  }
};

//Logout
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
