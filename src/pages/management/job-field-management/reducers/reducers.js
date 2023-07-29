import jobFieldActions from './actions'

const initialState = {
  openForm: false,
  selectedJobField: null,
  loading: false,
  reloadData: 0,
}

export default function jobFieldReducer(state = initialState, action) {
  switch (action.type) {
    case jobFieldActions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
