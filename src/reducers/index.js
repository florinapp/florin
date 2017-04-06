import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import dashboard from './dashboard'
import accounts from './accounts'
import categories from './categories'

const rootReducer = combineReducers({
  dashboard,
  accounts,
  categories,
  router: routerReducer
})

export default rootReducer