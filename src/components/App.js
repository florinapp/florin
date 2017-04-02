import React from 'react'
import Navigation from './Navigation'
import { Route, HashRouter } from 'react-router-dom'
import Dashboard from '../containers/dashboard/Dashboard'
import Accounts from './accounts/Accounts'

const App = () => {
  return (
    <HashRouter>
      <div>
        <Navigation />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/accounts" component={Accounts} />
      </div>
    </HashRouter>
  )
}

export default App
