import { RECEIVE_ACCOUNT_BALANCES_DATA, RECEIVE_ACCOUNTS_DATA } from '../actions'

const initState = {
    accounts: [],  // deprecate
    accountBalances: [],
}

const dashboard = (state=initState, action) => {
    switch (action.type) {
        case RECEIVE_ACCOUNT_BALANCES_DATA:
            return {
                ...state,
                accountBalances: action.accountBalances,
            }
        case RECEIVE_ACCOUNTS_DATA:
            return {
                ...state,
                accounts: action.accounts
            }
        default:
            return state
    }
}

export default dashboard