import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Line } from 'react-chartjs'

class TotalAssetsChart extends Component {
    componentDidMount() {
        let {onRefresh} = this.props
        onRefresh.call(this)
    }

    randColor() {
        // TODO: chart.js should provide this
        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        const a = Math.random()
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }

    render() {
        let {accountBalances, onRefresh} = this.props
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false
        }

        let dateBalanceMap = {}
        accountBalances.forEach((accountBalance) => {
            accountBalance.balances.forEach((balance) => {
                let accountBalancesOnTheDay = dateBalanceMap[balance.date] || {}
                accountBalancesOnTheDay[balance.account_id] = balance.balance
                dateBalanceMap[balance.date] = accountBalancesOnTheDay
            })
        })

        let datasets = []
        accountBalances.forEach((accountBalance) => {
            let dataset = {
                label: `${accountBalance.institution} - ${accountBalance.name}`,
                fillColor: this.randColor(),
                data: Object.keys(dateBalanceMap).map((date) => {
                    return dateBalanceMap[date][accountBalance.id] || 0
                }),
                fill: true,
            }
            datasets = [...datasets, dataset]
        })

        const chartData = {
            labels: Object.keys(dateBalanceMap),
            datasets: datasets,
        }

        console.log(chartData)

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
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        )
    }
}

export default TotalAssetsChart