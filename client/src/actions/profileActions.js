import axios from 'axios'
import {
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_CURRENT_PROFILE,
  SET_CURRENT_USER
} from './types'

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

// Create profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}

//add experience to profile
export const addExperience = (experienceData, history) => dispatch => {
  axios.post("/api/profile/experience", experienceData)
  .then(res => history.push("/dashboard"))
  .catch(err => dispatch({
    type: GET_ERRORS,
    data: err.response.data
  }))
}

//add education to profile
export const addEducation = (educationData, history) => dispatch => {
  axios.post("/api/profile/education", educationData)
  .then(res => history.push("/dashboard"))
  .catch(err => dispatch({
    type: GET_ERRORS,
    data: err.response.data
  }))
}

//delete an experience
export const deleteExperience = (id) => dispatch => {
  axios.delete(`/api/profile/experience/${id}`)
  .then(res => dispatch({
    type: GET_PROFILE,
    data: res.data
  })).catch(err => dispatch({
    type: GET_ERRORS,
    data: err.response.data
  }))
}


//delete an education
export const deleteEducation = (id) => dispatch => {
  axios.delete(`/api/profile/education/${id}`)
  .then(res => dispatch({
    type: GET_PROFILE,
    data: res.data
  })).catch(err => dispatch({
    type: GET_ERRORS,
    data: err.response.data
  }))
}

// delete account and profile
export const deleteAccount = () => dispatch => {
  if(window.confirm('Are you sure? Action can not be undone!')){
    axios
      .delete('/api/profile')
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          data: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          data: err.response.data
        })
      )
  }
}

