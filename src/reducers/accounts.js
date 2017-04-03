import { RECEIVE_ACCOUNTS_DATA, RECEIVE_TRANSACTIONS } from '../actions'

const initState = {
    accounts: [],
    currentAccountId: null,
    transactions: []  // transactions in the current selected account
}

const accounts = (state=initState, action) => {
    switch (action.type) {
        case RECEIVE_ACCOUNTS_DATA:
            return {
                ...state,
                accounts: action.accounts
            }
        case RECEIVE_TRANSACTIONS:
            return {
                ...state,
                transactions: action.transactions
            }
        default:
            return state
    }
}

export default accounts