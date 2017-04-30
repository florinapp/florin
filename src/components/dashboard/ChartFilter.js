import React from 'react'

const dateRangeFilters = [
    { name: 'thisMonth', caption: 'This Month' },
    { name: 'lastMonth', caption: 'Last Month' },
    { name: 'thisYear', caption: 'This Year' },
    { name: 'allTime', caption: 'All Time' },
]

const ChartFilter = ({onDateRangeChange, currentDateRange}) => {
    console.log(currentDateRange)
    return (
        <ul className="nav nav-pills">
            {dateRangeFilters.map(dateRangeFilter => (
                <li key={dateRangeFilter.name} className={currentDateRange === dateRangeFilter.name ? 'active' : ''}>
                    <a onClick={() => onDateRangeChange(dateRangeFilter.name)}>
                        {dateRangeFilter.caption}
                    </a>
                </li>
            ))}
        </ul>
    )
}

export default ChartFilter