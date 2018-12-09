import { GET_ERRORS, SET_CURRENT_USER } from './types'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import setAuthToken from '../utils/setAuthToken'

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}

// Login - Get user token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // save to local storage
      const { token } = res.data
      // set token to local storage
      localStorage.setItem('jwtToken', token)
      // set token to auth header
      setAuthToken(token)
      
      //token has some info about user like name email..need to extract user from token (jwt-decode)
      //decode token to get user data
      const decoded = jwt_decode(token)

      //set current user
      dispatch(setCurrentUser(decoded))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}

//setCurrentUser function used in loginUser
export const setCurrentUser = decoded =>{
  return{
    type: SET_CURRENT_USER,
    data: decoded
  }
}


//log user out
export const logoutUser = () => dispatch =>{
  //first remove token from localstorage
  localStorage.removeItem("jwtToken")
  //clear (remove) auth header for future requests
  setAuthToken(false) //function is looking for true value
  //set current user to an empty object {}, which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
}
