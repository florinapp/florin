import {
    RECEIVE_ACCOUNTS_DATA,
    RECEIVE_TRANSACTIONS,
    UPDATE_TRANSACTION_SUCCEEDED,
    DELETE_TRANSACTION_SUCCEEDED,
    EXCLUDE_TRANSACTION_SUCCEEDED,
    RECEIVE_CATEGORY_SUMMARY,
    CHANGE_TRANSACTION_PAGE_NUMBER,
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
    pagination: {
        totalPages: null,
        currentPage: 1
    },
    categorySummary: []
}

const handleLocationChange = (state, action) => {
    const { pathname, search } = action.payload
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
}

const handleUpdateTransactionSucceeded = (state, action) => {
    const { transactions } = state
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
}

const handleDeleteTransactionSucceeded = (state, action) => {
    const { transactionId } = action
    const { transactions } = state
    return {
        ...state,
        transactions: transactions.filter((transaction) => {
            return transaction.id !== transactionId
        })
    }
}

const handleExcludeTransactionSucceeded = (state, action) => {
    const { transactionId } = action
    const { transactions } = state
    return {
        ...state,
        transactions: transactions.filter((transaction) => {
            return transaction.id !== transactionId
        })
    }
}

const handleChangeTransactionPageNumber = (state, action) => {
    const { page } = action
    const { pagination } = state
    return {
        ...state,
        pagination: {
            ...pagination,
            currentPage: page
        }
    }
}

const accounts = (state=initState, action) => {
    switch (action.type) {
        case RECEIVE_ACCOUNTS_DATA:
            return {
                ...state,
                accounts: action.accounts
            }
        case RECEIVE_TRANSACTIONS:
            const { pagination } = action
            return {
                ...state,
                pagination,
                transactions: action.transactions
            }
        case '@@router/LOCATION_CHANGE':
            return handleLocationChange(state, action)
        case UPDATE_TRANSACTION_SUCCEEDED:
            return handleUpdateTransactionSucceeded(state, action)
        case DELETE_TRANSACTION_SUCCEEDED:
            return handleDeleteTransactionSucceeded(state, action)
        case EXCLUDE_TRANSACTION_SUCCEEDED:
            return handleExcludeTransactionSucceeded(state, action)
        case RECEIVE_CATEGORY_SUMMARY:
            const { categorySummary } = action
            return {
                ...state,
                categorySummary
            }
        case CHANGE_TRANSACTION_PAGE_NUMBER:
            return handleChangeTransactionPageNumber(state, action)
        default:
            return state
    }
}

export default accounts