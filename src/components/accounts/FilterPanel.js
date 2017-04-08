import React from 'react'
import { NavLink } from 'react-router-dom'

const toBool = (val) => {
    if (typeof(val) === 'boolean') {
        return val
    }
    if (val.toLowerCase() === 'true') {
        return true
    }
    return false
}

const q = (filter, replace) => {
    let params = {
        ...filter,
        ...replace
    }
    return Object.keys(params).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
}

const DateRangeFilterPanel = ({ currentAccountId, filter }) => {
    const dateRangeFilters = [
        { name: 'thisMonth', caption: 'This Month' },
        { name: 'lastMonth', caption: 'Last Month' },
        { name: 'thisYear', caption: 'This Year' }
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
                    Show Only Uncategorized
                </NavLink>
            </li>
            <li role="presentation" className={toBool(filter.includeExcluded) ? "active" : ""}>
                <NavLink to={`/accounts/${currentAccountId}?${q(filter, { includeExcluded: !(toBool(filter.includeExcluded)) })}`}>
                    Show Excluded
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