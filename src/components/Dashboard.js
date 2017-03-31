import React from 'react'
import TotalAssetsChart from '../containers/TotalAssetsChart'
import AccountOverview from '../containers/AccountOverview'

const Dashboard = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 col-lg-4">
          <AccountOverview />
        </div>
        <div className="col-md-8 col-lg-8">
          <TotalAssetsChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard