import React from 'react'
import { Route, Link } from 'react-router-dom'

const NavLink = (props) => {
  let { to, caption } = props
  return (
    <Route path={to} children={({match}) =>
      <li className={match ? "active" : ""} role="presentation"><Link to={to}>{caption}</Link></li>
    } />
  )
}

const Navigation = (props) => {
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand navbar-link" href="#">FLORIN</a>
          <button data-toggle="collapse" data-target="#navcol-1" className="navbar-toggle collapsed">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="nav navbar-nav">
            <NavLink to="/dashboard" caption="Dashboard" />
            <NavLink to="/accounts" caption="Accounts" />
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <NavLink to="/settings" caption="Settings" />
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation