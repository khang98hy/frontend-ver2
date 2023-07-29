import companyManagementActions from "./actions"

const initialState = {
  openForm: false,
  selectedCompany: null,
  loading: false,
  reloadData: 0,
}

export default function companyManagementReducer(state = initialState, action) {
  switch (action.type) {
    case companyManagementActions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
