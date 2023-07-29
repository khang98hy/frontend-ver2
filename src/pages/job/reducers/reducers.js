import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import jobActions from './actions'

const initialState = {
  jobList: [],
  pagination: {
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  },
  loading: false,
  searchText: null,
}

export default function jobReducer(state = initialState, action) {
  switch (action.type) {
    case jobActions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
