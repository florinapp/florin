import { combineReducers } from 'redux'
import dashboard from './dashboard'
import accounts from './accounts'

const rootReducer = combineReducers({
  dashboard,
  accounts
})

export default rootReducer