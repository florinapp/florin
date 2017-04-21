import React, { Component } from 'react'
import { ResponsiveContainer, AreaChart, Area, YAxis, XAxis, Tooltip } from 'recharts'

const generateColor = () => {
    var r = (Math.round(Math.random() * 127) + 127).toString(16);
    var g = (Math.round(Math.random() * 127) + 127).toString(16);
    var b = (Math.round(Math.random() * 127) + 127).toString(16);
    return '#' + r + g + b;
}

class TotalAssetsChart extends Component {
    componentDidMount() {
        let {onRefresh} = this.props
        onRefresh.call(this)
    }

    render() {
        let {assets, onRefresh} = this.props
        assets = assets || {}
        let accounts = Object.keys(assets.accounts || {})
        let data = assets.data || []
        let colors = [...Array(accounts.length).keys()].map(()=>generateColor())
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Total Assets over time</span>
                    <div className="pull-right">
                        <button type="button" className="btn btn-primary btn-xs" onClick={onRefresh}>
                            <span className="fa fa-refresh"></span>&nbsp;Refresh
                        </button>
                    </div>
                </div>
                <div className="panel-body">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            {accounts.map((account, idx) => (
                                <Area name={assets.accounts[account]} key={account} type="monotone" dataKey={account} stackId="1" stroke={colors[idx]} fillOpacity={1} fill={colors[idx]} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )

    }
}

export default TotalAssetsChart