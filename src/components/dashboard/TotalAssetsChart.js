import React, { Component } from 'react'
import ChartFilter from './ChartFilter'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import COLORS from '../../colors'

const transformChartData = (chartData) => {
    let dateAccountMap = {}

    chartData.forEach(accountData => {
        let accountName = `${accountData.account.institution} - ${accountData.account.name}`
        accountData.history.forEach(accountHistory => {
            dateAccountMap[accountHistory.date] = dateAccountMap[accountHistory.date] || {}
            dateAccountMap[accountHistory.date][accountName] = parseFloat(accountHistory.balance)
        })
    })


    return Object.entries(dateAccountMap).map(([date, data]) => {
        data['date'] = date
        return data
    })
}

const getAccountNames = (chartData) => {
    return chartData.map(accountData => {
        return `${accountData.account.institution} - ${accountData.account.name}`
    })
}

class TotalAssetsChart extends Component {
    componentDidMount() {
        const {onDateRangeChange, currentDateRange} = this.props
        onDateRangeChange(currentDateRange)
    }

    render() {
        const {accountBalancesChartData, onDateRangeChange, currentDateRange} = this.props
        let accounts = getAccountNames(accountBalancesChartData)
        let chartData = transformChartData(accountBalancesChartData)

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Account Balance Chart</span>
                </div>
                <div className="panel-body">
                    <ChartFilter currentDateRange={currentDateRange} onDateRangeChange={onDateRangeChange}/>
                    {chartData.length === 0 ? "" :
                        <AreaChart width={1200} height={400} data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            {accounts.map((account, idx) => (
                                <Area key={idx} type="monotone" dataKey={account} stackId="1" stroke={COLORS[idx % COLORS.length]} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </AreaChart>
                    }
                </div>
            </div>
        )
    }
}

export default TotalAssetsChart