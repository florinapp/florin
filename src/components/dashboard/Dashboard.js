import React from 'react'
import TotalAssetsChart from '../../containers/dashboard/TotalAssetsChart'
import AccountOverview from '../../containers/dashboard/AccountOverview'

const Dashboard = () => {
  return (
    <div>
      <div className="col-md-6 col-lg-3">
        <AccountOverview />
      </div>
      <div className="col-md-6 col-lg-9">
        <TotalAssetsChart />
      </div>
    </div>
  )
}

export default Dashboard