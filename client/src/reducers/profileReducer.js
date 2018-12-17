import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_PROFILES } from '../actions/types'

const initialState = {
  profile: null,
  profiles: null,
  loading: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_PROFILE:
      return {
        ...state,
        profile: action.data,
        loading: false
      }
    case CLEAR_CURRENT_PROFILE:
    return {
        ...state,
        profile: null
    }
    case GET_PROFILES:
    return {
      ...state,
      profiles: action.data, 
      loading: false
    }
    default:
      return state
  }
}
