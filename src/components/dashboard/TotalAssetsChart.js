import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import NVD3Chart from 'react-nvd3'
import currencyFormatter from 'currency-formatter'
import d3 from 'd3'
import 'nvd3/build/nv.d3.css'
import ChartFilter from './ChartFilter'

class TotalAssetsChart extends Component {
    componentDidMount() {
        let {onRefresh} = this.props
        onRefresh.call(this)
    }

    render() {
        const {accountBalancesChartData, onRefresh} = this.props
        console.log(accountBalancesChartData)
        const data = accountBalancesChartData.map(accountBalancesChartDatum => {
            return {
                key: `${accountBalancesChartDatum.account.institution} - ${accountBalancesChartDatum.account.name}`,
                values: accountBalancesChartDatum.history,
            }
        })
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Total Assets Estimate</span>
                    <div className="pull-right">
                        <Button bsStyle="primary" bsSize="xsmall" onClick={onRefresh}>
                            <span className="fa fa-refresh"></span>&nbsp;Refresh
                        </Button>
                    </div>
                </div>
                <div className="panel-body">
                    <ChartFilter />
                    <NVD3Chart
                        type="lineChart"
                        xAxis={{ tickFormat: (d) => d3.time.format('%x')(new Date(d)) }}
                        yAxis={{ tickFormat: (d) => currencyFormatter.format(d, {code: 'CAD'}) }}
                        x={(d) => new Date(d[0]).getTime()}
                        y={(d) => d[1]}
                        datum={data}
                    />
                </div>
            </div>
        )
    }
}

export default TotalAssetsChart