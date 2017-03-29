import React from 'react'
import Navigation from './Navigation'
import { Route, HashRouter } from 'react-router-dom'
import Dashboard from './Dashboard';

const Account = () => <div>Account</div>

const App = () => {
  return (
    <HashRouter>
      <div>
        <Navigation />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/account" component={Account} />
      </div>
    </HashRouter>
  )
}

export default App
