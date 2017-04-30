import {
    RECEIVE_ACCOUNT_BALANCES_CHART_DATA,
    RECEIVE_ACCOUNT_BALANCES_DATA,
    CHANGE_DASHBOARD_SELECTED_ACCOUNT,
    DELETE_ACCOUNT_BALANCE_SUCCEEDED,
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
        case CHANGE_DASHBOARD_SELECTED_ACCOUNT:
            return {
                ...state,
                currentAccountId: (state.currentAccountId === action.accountId ? null : action.accountId)
            }
        case DELETE_ACCOUNT_BALANCE_SUCCEEDED:
            const accountBalanceId = action.id
            return {
                ...state,
                accountBalances: state.accountBalances.map(accountBalance => {
                    return {
                        ...accountBalance,
                        balances: accountBalance.balances.filter(balance => {
                            return balance.id !== accountBalanceId
                        })
                    }
                })
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