import axios from 'axios'
import {
  ADD_POST,
  GET_POSTS,
  GET_ERRORS,
  POST_LOADING,
  DELETE_POST,
  GET_POST,
  CLEAR_ERRORS
} from './types'

// add post
export const addPost = postData => dispatch => {
  dispatch(clearErrors())
  axios
    .post('/api/posts', postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        data: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}

// loading
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}

// get posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading())
  axios
    .get('/api/posts')
    .then(res =>
      dispatch({
        type: GET_POSTS,
        data: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        data: null
      })
    )
}

// delete post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        data: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}

// like post
export const addLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}

// unlike post
export const removeLike = id => dispatch => {
  axios
    .delete(`/api/posts/unlike/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}

// get single post
export const getPost = id => dispatch => {
  dispatch(setPostLoading())
  axios
    .get(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        data: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        data: null
      })
    )
}

// comment on post
export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors())
  axios
    .post(`/api/posts/comments/${postId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_POST,
        data: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}


// delete comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comments/${postId}/${commentId}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        data: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        data: err.response.data
      })
    )
}


//clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}
