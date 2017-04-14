import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import dashboard from './dashboard'
import accounts from './accounts'
import categories from './categories'
import ui from './ui'

const rootReducer = combineReducers({
  dashboard,
  accounts,
  categories,
  ui,
  router: routerReducer
})

export default rootReducer