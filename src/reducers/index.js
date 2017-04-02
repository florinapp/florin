import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import dashboard from './dashboard'
import accounts from './accounts'

const rootReducer = combineReducers({
  dashboard,
  accounts,
  router: routerReducer
})

export default rootReducer