import axios from 'axios'
import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE } from './types'

// get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading())
  axios
    .get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        data: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        data: {} // user can be registered but he/she doesnt need to have profile, so empty profile will be returned
      })
    )
}

// setPofileLoading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}


// clear profile
export const clearCurrentProfile = () => {
    return {
      type: CLEAR_CURRENT_PROFILE
    }
  }
  

//Create profile
export const createProfile = (profileData, history) => dispatch =>{
  axios.post("/api/profile", profileData)
  .then(res => history.push("/dashboard")).catch(err =>
    dispatch({
      type: GET_ERRORS,
      data: err.response.data
    }))
}