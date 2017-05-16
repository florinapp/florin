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

class MonthsAgo extends DateRangeFilter {
    constructor({name, caption, numMonths}) {
        super({name, caption})
        this.numMonths = numMonths
    }


    getDateRangeFilterParam() {
        const lastMonth = moment(this.getNow() - moment.duration(this.numMonths, 'month'))
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

const lastMonth = new MonthsAgo({name: 'lastMonth', caption: 'Last Month', numMonths: 1})

const twoMonthsAgo = new MonthsAgo({name: 'twoMonthsAgo', caption: 'Two Months Ago', numMonths: 2})

export const DATE_RANGE_FILTERS = [
    new ThisMonth(),
    lastMonth,
    twoMonthsAgo,
    new ThisYear(),
    new DateRangeFilter({name: 'allTime', caption: 'All Time'}),
]

const DATE_RANGE_FILTER_MAP = DATE_RANGE_FILTERS.reduce((aggregatedMap, currentFilter) => {
    aggregatedMap[currentFilter.name] = currentFilter
    return aggregatedMap
}, {})

export const getDateRangeFilterByName = (name) => {
    return DATE_RANGE_FILTER_MAP[name]
}