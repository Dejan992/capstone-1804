import axios from 'axios'

const SET_ALL_REVIEWS_OF_RESOURCE = 'SET_ALL_REVIEWS_OF_RESOURCE'
const REVIEW_RESOURCE = 'REVIEW_RESOURCE'

const setAllReviewsOfResource = (reviews) => {
  return {
    type: SET_ALL_REVIEWS_OF_RESOURCE,
    reviews
  }
}

const reviewResource = (review) => {
  return {
    type: REVIEW_RESOURCE,
    review
  }
}

export const getAllReviewsOfResource = (uid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/resources/${uid}/reviews`)
    dispatch(setAllReviewsOfResource(data))
  }
}

export const addResourceReview = (rating) => {
  const urlEncoded = encodeURIComponent(rating.resourceUrl)

  return async (dispatch) => {
    await axios.post(`/api/userAuth/resources/${urlEncoded}/review`, rating)
    dispatch(reviewResource(rating))
  }
}

const initialState = {
  allResourceReviews: [],
  // lastRating: []
}

export default function( state = initialState, action ){
  switch (action.type) {
    case SET_ALL_REVIEWS_OF_RESOURCE: {
      return {...state, allResourceReviews: [...state.allResourceReviews, action.reviews]}
    }
    // case REVIEW_RESOURCE:
    //   return {...state, lastRating: action.rating}
    default:
      return state
  }
}
