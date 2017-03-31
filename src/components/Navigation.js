import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
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
            <li role="presentation"><Link to="dashboard">Dashboard</Link></li>
            <li role="presentation"><Link to="accounts">Accounts</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation