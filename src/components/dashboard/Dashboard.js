import React from 'react'
import TotalAssetsChart from '../../containers/dashboard/TotalAssetsChart'
import AccountOverview from '../../containers/dashboard/AccountOverview'
import FlashMessage from '../../containers/FlashMessage'

const Dashboard = () => {
  return (
    <div>
      <FlashMessage />
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