import recruitmentActions from './actions'

const initialState = {
  openForm: false,
  selectedJob: null,
  reloadData: 0,

  openCandidateList: false,

  openAcceptForm: false,
  selectedApplicationJob: null,
  reloadCandidate: 0,
}

export default function recruitmentReducer(state = initialState, action) {
  switch (action.type) {
    case recruitmentActions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
