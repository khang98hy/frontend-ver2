import userManagementActions from "./actions"

const initialState = {
  openForm: false,
  selectedUser: null,
  loading: false,
  reloadData: 0,
}

export default function userManagementReducer(state = initialState, action) {
  switch (action.type) {
    case userManagementActions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
