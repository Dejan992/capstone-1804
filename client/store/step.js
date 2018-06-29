import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STEP_COMPLETIONS_FOR_USER = 'GET_STEP_COMPLETIONS_FOR_USER'
const TOGGLE_STEP_COMPLETION = 'TOGGLE_STEP_COMPLETION'
const GET_STEP_RESOURCE = 'GET_STEP_RESOURCE'

/**
 * ACTION CREATORS
 */
const getStepCompletionSingleUser = (completed) => {
  return {
    type: GET_STEP_COMPLETIONS_FOR_USER,
    completed
  }
}

const toggleStepCompletion = (stepUrl) => {
  return {
    type: TOGGLE_STEP_COMPLETION,
    stepUrl
  }
}

const getStepResource = (resource) => {
  return {
    type: GET_STEP_RESOURCE,
    resource
  }
}

/**
 * THUNK CREATORS
 */
export const getStepCompletionSingleUserThunk = (uid, username) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${uid}/user/${username}/completed`)
    dispatch(getStepCompletionSingleUser(data))
  }
}

export const toggleStepCompletionThunk = (pathUid, username, stepUrl, bool) => {
  return async (dispatch) => {
    const urlEncoded = encodeURIComponent(stepUrl)

    await axios.put(`/api/paths/${pathUid}/user/${username}/status/${bool}/step/${urlEncoded}`)

    dispatch(toggleStepCompletion(stepUrl))
  }
}

export const getStepResourceThunk = (url) => {
  return async (dispatch) => {
    const urlEncoded = encodeURIComponent(url)
    const { data } = await axios.get(`/api/paths/step/${urlEncoded}`)
    dispatch(getStepResource(data))
  }
}


/**
 * REDUCER
 */
const initialState = {
  completedSteps: [],
  resource: []
}

export default function( state = initialState, action) {
  switch (action.type) {
    case GET_STEP_COMPLETIONS_FOR_USER:
      return {...state, completedSteps: action.completed}
    case TOGGLE_STEP_COMPLETION: {
      const completedSteps = state.completedSteps.map((step) => {
        if(step.stepUrl === action.stepUrl){
          step.completed = !step.completed
        }
        return step
      })
      return {...state, completedSteps}
    }
    case GET_STEP_RESOURCE: {
      return {...state, resource: [action.resource]}
    }
    default:
      return state
  }
}
