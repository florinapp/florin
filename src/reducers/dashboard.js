import {
    RECEIVE_ACCOUNT_BALANCES_CHART_DATA,
    RECEIVE_ACCOUNT_BALANCES_DATA,
    REQUEST_ACCOUNT_BALANCES_CHART_DATA,
} from '../actions'

const initState = {
    accountBalances: [],
    accountBalancesChartData: [],
    currentAccountId: null,
    currentDateRange: 'thisMonth',
}

const dashboard = (state=initState, action) => {
    switch (action.type) {
        case RECEIVE_ACCOUNT_BALANCES_DATA:
            return {
                ...state,
                accountBalances: action.accountBalances,
            }
        case RECEIVE_ACCOUNT_BALANCES_CHART_DATA:
            return {
                ...state,
                accountBalancesChartData: action.accountBalancesChartData
            }
        case REQUEST_ACCOUNT_BALANCES_CHART_DATA:
            return {
                ...state,
                currentDateRange: action.dateRange
            }
        default:
            return state
    }
}

export default dashboard