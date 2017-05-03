import React, { Component } from 'react'
import NVD3Chart from 'react-nvd3'
import currencyFormatter from 'currency-formatter'
import d3 from 'd3'
import 'nvd3/build/nv.d3.css'
import ChartFilter from './ChartFilter'

class TotalAssetsChart extends Component {
    componentDidMount() {
        const {onDateRangeChange, currentDateRange} = this.props
        onDateRangeChange(currentDateRange)
    }

    render() {
        const {accountBalancesChartData, onDateRangeChange, currentDateRange} = this.props
        const data = accountBalancesChartData.map(accountBalancesChartDatum => {
            return {
                key: `${accountBalancesChartDatum.account.institution} - ${accountBalancesChartDatum.account.name}`,
                values: accountBalancesChartDatum.history,
            }
        })
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Account Balance Chart</span>
                </div>
                <div className="panel-body">
                    <ChartFilter currentDateRange={currentDateRange} onDateRangeChange={onDateRangeChange}/>
                    <NVD3Chart
                        type="lineChart"
                        xAxis={{ tickFormat: (d) => d3.time.format('%x')(new Date(d)) }}
                        yAxis={{ tickFormat: (d) => currencyFormatter.format(d, {code: 'CAD'}) }}
                        x={(d) => new Date(d.date).getTime()}
                        y={(d) => d.balance}
                        height="450px"
                        datum={data}
                    />
                </div>
            </div>
        )
    }
}

export default TotalAssetsChart