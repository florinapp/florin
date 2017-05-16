import q from './q'
import moment from 'moment'

const FORMAT = 'YYYY-MM-DD'

class DateRangeFilter {
    constructor({name, caption}) {
        this.name = name
        this.caption = caption
    }

    getNow() {
        return moment(moment.now())
    }

    generateQueryString(otherFilter) {
        return q(otherFilter, {currentDateRange: this.name})
    }

    getDateRangeFilterParam() {
        return {}
    }
}

class ThisMonth extends DateRangeFilter {
    constructor() {
        super({name: 'thisMonth', caption: 'This Month'})
    }

    getDateRangeFilterParam() {
        const now = this.getNow()
        return {
            startDate: now.startOf('month').format(FORMAT),
            endDate: now.endOf('month').format(FORMAT)
        }
    }
}

class LastMonth extends DateRangeFilter {
    constructor() {
        super({name: 'lastMonth', caption: 'Last Month'})
    }

    getDateRangeFilterParam() {
        const lastMonth = moment(this.getNow()- moment.duration(32, 'd'))
        return {
            startDate: lastMonth.startOf('month').format(FORMAT),
            endDate: lastMonth.endOf('month').format(FORMAT)
        }
    }
}

class ThisYear extends DateRangeFilter {
    constructor() {
        super({name: 'thisYear', caption: 'This Year'})
    }

    getDateRangeFilterParam() {
        const now = this.getNow()
        return {
            startDate: now.startOf('year').format(FORMAT),
            endDate: now.endOf('year').format(FORMAT)
        }
    }
}

class AllTime extends DateRangeFilter {
    constructor() {
        super({name: 'allTime', caption: 'All Time'})
    }
}

export const DATE_RANGE_FILTERS = [
    new ThisMonth(),
    new LastMonth(),
    new ThisYear(),
    new AllTime(),
]

const DATE_RANGE_FILTER_MAP = DATE_RANGE_FILTERS.reduce((aggregatedMap, currentFilter) => {
    aggregatedMap[currentFilter.name] = currentFilter
    return aggregatedMap
}, {})

export const getDateRangeFilterByName = (name) => {
    return DATE_RANGE_FILTER_MAP[name]
}