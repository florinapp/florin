import React from 'react'
import { NavLink } from 'react-router-dom'

const FilterPanel = ({currentAccountId, filter}) => {
    console.log(filter)
    const dateRangeFilters = [
        {name: 'thisMonth', caption: 'This Month'},
        {name: 'lastMonth', caption: 'Last Month'},
        {name: 'thisYear', caption: 'This Year'}
    ]

    const q = (filter, replace) => {
        let params = {
            ...filter,
            ...replace
        }
        return Object.keys(params).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
    }

    const toBool = (val) => {
        if (typeof(val) === 'boolean') {
            return val
        }
        if (val.toLowerCase() === 'true') {
            return true
        }
        return false
    }
    const { currentDateRange } = filter
    return (
        <div className="filter-panel">
            <ul className="nav nav-pills">
                {dateRangeFilters.map((dateRangeFilter) => (
                        <li key={dateRangeFilter.name} role="presentation"
                            className={currentDateRange === dateRangeFilter.name ? "active" : ""}>
                            <NavLink to={`/accounts/${currentAccountId}?${q(filter, {currentDateRange: dateRangeFilter.name})}`}>
                                {dateRangeFilter.caption}
                            </NavLink>
                        </li>
                ))}
                <li>
                    <hr />
                </li>
                <li role="presentation" className={toBool(filter.includeUncategorized) ? "active" : ""}>
                    <NavLink to={`/accounts/${currentAccountId}?${q(filter, {includeUncategorized: !(toBool(filter.includeUncategorized))})}`}>
                        Uncategorized
                    </NavLink>
                </li>
                <li>
                    <NavLink to="#">Show Excluded</NavLink>
                </li>
            </ul>
        </div>
    )
}

export default FilterPanel