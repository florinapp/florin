import React from 'react'
import { NavLink } from 'react-router-dom'
import q from '../../q'

const toBool = (val) => {
    if (typeof(val) === 'boolean') {
        return val
    }
    if (val.toLowerCase() === 'true') {
        return true
    }
    return false
}

const DateRangeFilterPanel = ({ currentAccountId, filter }) => {
    const dateRangeFilters = [
        { name: 'thisMonth', caption: 'This Month' },
        { name: 'lastMonth', caption: 'Last Month' },
        { name: 'thisYear', caption: 'This Year' },
        { name: 'allTime', caption: 'All Time' },
    ]

    const { currentDateRange } = filter

    return (
        <ul className="nav nav-pills">
            {dateRangeFilters.map((dateRangeFilter) => (
                <li key={dateRangeFilter.name} role="presentation"
                    className={currentDateRange === dateRangeFilter.name ? "active" : ""}>
                    <NavLink to={`/accounts/${currentAccountId}?${q(filter, { currentDateRange: dateRangeFilter.name })}`}>
                        {dateRangeFilter.caption}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
}

const SpecialFilterPanel = ({ currentAccountId, filter }) => {

    return (
        <ul className="nav nav-pills">
            <li role="presentation" className={toBool(filter.onlyUncategorized) ? "active" : ""}>
                <NavLink to={`/accounts/${currentAccountId}?${q(filter, { onlyUncategorized: !(toBool(filter.onlyUncategorized)) })}`}>
                    Only Show Uncategorized
                </NavLink>
            </li>
            <li role="presentation" className={toBool(filter.includeInternalTransfer) ? "active" : ""}>
                <NavLink to={`/accounts/${currentAccountId}?${q(filter, { includeInternalTransfer: !(toBool(filter.includeInternalTransfer)) })}`}>
                    Show Internal Transfers
                </NavLink>
            </li>
        </ul>
    )
}

const FilterPanel = ({currentAccountId, filter}) => {
    return (
        <div className="filter-panel">
            <DateRangeFilterPanel currentAccountId={currentAccountId} filter={filter} />
            <SpecialFilterPanel currentAccountId={currentAccountId} filter={filter} />
            <hr />
        </div>
    )
}

export default FilterPanel