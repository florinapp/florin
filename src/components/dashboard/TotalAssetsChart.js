import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-basic'

const PlotlyComponent = createPlotlyComponent(Plotly)

const retroFit = (serie, allDates) => {
    let { x, y } = serie
    let retroFitDataPoints = {}

    if (allDates[0] < x[0]) {
        retroFitDataPoints[allDates[0]] = y[1]
    }
    let i = 1  // counter for x and y
    let j = 1  // counter for allDates
    do {
        let date = x[i]
        let dateToFit = allDates[j]

        if (dateToFit === date) {
            i += 1
            j += 1
            continue
        }
        if (dateToFit > date) {
            i += 1
            continue
        }
        if (dateToFit < date) {
            retroFitDataPoints[dateToFit] = y[i - 1]
            j += 1
            continue
        }
    } while (j < allDates.length && i < x.length)

    if (j > i && j < allDates.length) {
        let previousBalance = y[i - 1]
        for (; j < allDates.length; j++) {
            retroFitDataPoints[allDates[j]] = previousBalance
        }
    }

    x.forEach((itemX, idx) => {
        let itemY = y[idx]
        retroFitDataPoints[itemX] = itemY
    })

    for (let date in retroFitDataPoints) {
        let balance = retroFitDataPoints[date]
        x.push(date)
        y.push(balance)
    }

    let sortedDates = Object.keys(retroFitDataPoints)
    sortedDates.sort()

    let balances = sortedDates.map((date) => retroFitDataPoints[date])
    return {
        ...serie,
        x: sortedDates,
        y: balances,
        text: balances,
        fill: 'tonexty',
    }
}

const stackedArea = (series) => {
    for (let i = 1; i < series.length; i++) {
        for (var j = 0; j < (Math.min(series[i]['y'].length, series[i - 1]['y'].length)); j++) {
            series[i]['y'][j] += series[i - 1]['y'][j]
        }
    }
    return series
}

const getData = (accountBalances) => {
    let allDates = {}
    accountBalances.forEach((accountBalance) => {
        accountBalance.balances.forEach((balance) => {
            allDates[balance.date] = null
        })
    })

    allDates = Object.keys(allDates)
    allDates.sort()

    let series = accountBalances.map((accountBalance) => {
        const balances = accountBalance.balances
        return {
            name: `${accountBalance.institution} - ${accountBalance.name}`,
            x: balances.map(balance => balance.date),
            y: balances.map(balance => balance.balance),
        }
    })

    series = series.map((serie) => retroFit(serie, allDates))
    if (series.length > 0) {
        series[0].fill = 'tozeroy'
    }
    series = stackedArea(series)
    return series
}

const getLayout = (accountBalances) => {
    return {
        xaxis: {
            title: 'Date'
        },
        yaxis: {
            title: "$"
        },
    }
}

const config = {
    showLink: false,
    displayModeBar: false,
}

class TotalAssetsChart extends Component {
    componentDidMount() {
        let {onRefresh} = this.props
        onRefresh.call(this)
    }

    render() {
        const {accountBalances, onRefresh} = this.props

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
                    <PlotlyComponent
                        data={getData(accountBalances)}
                        layout={getLayout(accountBalances)}
                        config={config}
                    />
                </div>
            </div>
        )
    }
}

export default TotalAssetsChart