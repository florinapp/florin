import {
    RECEIVE_ACCOUNTS_DATA,
    RECEIVE_TRANSACTIONS,
    UPDATE_TRANSACTION_SUCCEEDED,
    DELETE_TRANSACTION_SUCCEEDED,
    EXCLUDE_TRANSACTION_SUCCEEDED,
    RECEIVE_CATEGORY_SUMMARY,
} from '../actions'
import querystring from 'querystring'
import { matchPath } from 'react-router'

const initState = {
    accounts: [],
    currentAccountId: "_all",
    transactions: [],  // transactions in the current selected account
    filter: {
        currentDateRange: 'thisMonth',
        includeExcluded: false,
        onlyUncategorized: false
    },
    categorySummary: []
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
            const {pathname, search} = action.payload
            const match = matchPath(pathname, {
                path: '/accounts/:accountId'
            })
            if (match) {
                console.log(match)
                let queryParams = querystring.parse(search.slice(1, search.length))
                return {
                    ...state,
                    currentAccountId: match.params.accountId,
                    filter: {
                        currentDateRange: queryParams.currentDateRange || 'thisMonth',
                        onlyUncategorized: queryParams.onlyUncategorized || false,
                        includeExcluded: queryParams.includeExcluded || false
                    }
                }
            }
            return state
        case UPDATE_TRANSACTION_SUCCEEDED:
            let { transactions } = state
            const theTransaction = action.transaction
            const updatedTransactions = transactions.map((transaction) => {
                if (transaction.id !== theTransaction.id) {
                    return transaction
                }
                return theTransaction
            })
            return {
                ...state,
                transactions: updatedTransactions
            }
        case DELETE_TRANSACTION_SUCCEEDED:
            let { transactionId } = action
            transactions = state.transactions
            return {
                ...state,
                transactions: transactions.filter((transaction) => {
                    return transaction.id !== transactionId
                })
            }
        case EXCLUDE_TRANSACTION_SUCCEEDED:
            transactionId = action.transactionId
            transactions = state.transactions
            return {
                ...state,
                transactions: transactions.filter((transaction) => {
                    return transaction.id !== transactionId
                })
            }
        case RECEIVE_CATEGORY_SUMMARY:
            const { categorySummary } = action
            return {
                ...state,
                categorySummary
            }
        default:
            return state
    }
}

export default accounts