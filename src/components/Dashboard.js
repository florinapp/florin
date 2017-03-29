import React from 'react'
import TotalAssetsChart from '../containers/TotalAssetsChart'

const Dashboard = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 col-lg-12">
          <TotalAssetsChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard