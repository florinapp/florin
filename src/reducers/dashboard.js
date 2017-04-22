import { RECEIVE_ACCOUNT_BALANCES_DATA, CHANGE_DASHBOARD_SELECTED_ACCOUNT } from '../actions'

const initState = {
    accountBalances: [],
    currentAccountId: null,
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
        default:
            return state
    }
}

export default dashboard