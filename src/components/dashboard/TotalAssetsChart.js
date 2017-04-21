import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Line } from 'react-chartjs'

class TotalAssetsChart extends Component {
    componentDidMount() {
        let {onRefresh} = this.props
        onRefresh.call(this)
    }

    render() {
        let {accountBalances, onRefresh} = this.props
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false
        }
        console.log(accountBalances)
        // assets = assets || {}
        // let accounts = Object.keys(assets.accounts || {})
        // let data = assets.data || []
        // let colors = [...Array(accounts.length).keys()].map(()=>generateColor())
        const chartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    data: [65, 59, 80, 81, 56, 55, 40],
                }
            ]
        }
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Total Assets over time</span>
                    <div className="pull-right">
                        <Button bsStyle="primary" bsSize="xsmall" onClick={onRefresh}>
                            <span className="fa fa-refresh"></span>&nbsp;Refresh
                        </Button>
                    </div>
                </div>
                <div className="panel-body">
                    <div className="chart-holder">
                        <Line data={chartData} options={chartOptions}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default TotalAssetsChart