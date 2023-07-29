import companyActions from './actions'

const initialState = {
  searchText: null,
}

export default function companyReducer(state = initialState, action) {
  switch (action.type) {
    case companyActions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
