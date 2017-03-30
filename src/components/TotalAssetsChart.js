import React from 'react'
import { ResponsiveContainer, Line, LineChart, XAxis, CartesianGrid, Tooltip } from 'recharts'
import ChartFilter from './ChartFilter'

const TotalAssetsChart = ({data, onRefresh, onLastMonth, onTwoMonthsAgo, onYearToDate, onAllTime}) => {
    let charFilterProps = {onLastMonth, onTwoMonthsAgo, onYearToDate, onAllTime}
    console.log(charFilterProps)
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <span className="panel-title">Total Assets over time</span>
                <div className="pull-right">
                    <button type="button" className="btn btn-primary btn-sm" onClick={onRefresh}>
                        <span className="glyphicon glyphicon-refresh"></span>
                    </button>
                </div>
            </div>
            <div className="panel-body">
                <ChartFilter {...charFilterProps}/>
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

export default TotalAssetsChart