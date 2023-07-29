import cvActions from './actions'

const initialState = {
  openForm: null,
  selectedCv: null,
  reloadData: 0,
}

export default function cvReducer(state = initialState, action) {
  switch (action.type) {
    case cvActions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
