import React from 'react'
import { ResponsiveContainer, Line, LineChart, XAxis, CartesianGrid, Tooltip } from 'recharts'


const TotalAssetsChart = () => {
  let data = [
    {'date': '2015-01-01', 'amount': 50911},
    {'date': '2015-02-01', 'amount': 48913},
    {'date': '2015-03-01', 'amount': 51132},
    {'date': '2015-04-01', 'amount': 52311},
    {'date': '2015-05-01', 'amount': 53914},
    {'date': '2015-06-01', 'amount': 60013},
  ]

  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Total Assets over time</h3>
      </div>
      <div className="panel-body">
        <ChartFilter />
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


const ChartFilter = () => {
    return (
        <ul className="nav nav-pills">
            <li className="active"><a href="#">Last Month</a></li>
            <li><a href="#">2 Months Ago</a></li>
            <li><a href="#">Year to Date</a></li>
            <li><a href="#">All Time</a></li>
        </ul>
    )
}

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