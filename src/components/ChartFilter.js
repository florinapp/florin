import React, { Component } from 'react'
import './ChartFilter.css'

class ChartFilter extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { onLastMonth, onTwoMonthsAgo, onYearToDate, onAllTime } = this.props
        return (
            <ul className="nav nav-pills">
                <li name="last-month" className="active"><a onClick={onLastMonth}>Last Month</a></li>
                <li><a onClick={onTwoMonthsAgo}>2 Months Ago</a></li>
                <li><a onClick={onYearToDate}>Year to Date</a></li>
                <li><a onClick={onAllTime}>All Time</a></li>
            </ul>
        )
    }
}

export default ChartFilter