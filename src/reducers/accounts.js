import { RECEIVE_ACCOUNTS_DATA, RECEIVE_TRANSACTIONS } from '../actions'
import { matchPath } from 'react-router'

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
        case '@@router/LOCATION_CHANGE':
            const {pathname} = action.payload
            const match = matchPath(pathname, {
                path: '/accounts/:accountId'
            })
            if (match) {
                return {
                    ...state,
                    currentAccountId: match.params.accountId
                }
            }
            return state
        default:
            return state
    }
}

export default accounts