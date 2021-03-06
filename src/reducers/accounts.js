import {
    RECEIVE_ACCOUNTS_DATA,
    RECEIVE_TRANSACTIONS,
    UPDATE_TRANSACTION_SUCCEEDED,
    DELETE_TRANSACTION_SUCCEEDED,
    FLAG_AS_INTERNAL_TRANSACTION_SUCCEEDED,
    RECEIVE_CATEGORY_SUMMARY,
    CHANGE_TRANSACTION_PAGE_NUMBER,
    CREATE_ACCOUNT_SUCCEEDED,
    UPDATE_ACCOUNT_SUCCEEDED,
    DELETE_ACCOUNT_SUCCEEDED,
    RECEIVE_ACCOUNT_TYPES,
    RECEIVE_ACCOUNT_BALANCES_DATA,
    DELETE_ACCOUNT_BALANCE_SUCCEEDED,
} from '../actions'
import querystring from 'querystring'
import { matchPath } from 'react-router'

const initState = {
    accounts: [],
    accountTypes: [],
    accountBalances: [],
    currentAccountId: "_all",
    transactions: [],  // transactions in the current selected account
    filter: {
        currentDateRange: 'thisMonth',
        includeInternalTransfer: false,
        onlyUncategorized: false
    },
    sort: {
        orderBy: "date:desc"
    },
    pagination: {
        totalPages: null,
        currentPage: 1
    },
    categorySummary: {income: [], expense: []},
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
                includeInternalTransfer: queryParams.includeInternalTransfer || false
            },
            sort: {
                orderBy: queryParams.orderBy || "date:desc"
            },
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
            return transaction.id.toString() !== transactionId.toString()
        })
    }
}

const handleFlagAsInternalTransferSucceeded = (state, action) => {
    const { transactionId } = action
    const { transactions } = state
    return {
        ...state,
        transactions: transactions.filter((transaction) => {
            return transaction.id.toString() !== transactionId.toString()
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
        case FLAG_AS_INTERNAL_TRANSACTION_SUCCEEDED:
            return handleFlagAsInternalTransferSucceeded(state, action)
        case RECEIVE_CATEGORY_SUMMARY:
            const { categorySummary } = action
            return {
                ...state,
                categorySummary
            }
        case CHANGE_TRANSACTION_PAGE_NUMBER:
            return handleChangeTransactionPageNumber(state, action)
        case CREATE_ACCOUNT_SUCCEEDED:
            return {
                ...state,
                accounts: [...state.accounts, action.account]
            }
        case UPDATE_ACCOUNT_SUCCEEDED:
            return {
                ...state,
                accounts: state.accounts.map((account) => {
                    if (account.id.toString() !== action.account.id.toString()) {
                        return account
                    } else {
                        return action.account
                    }
                })
            }
        case DELETE_ACCOUNT_SUCCEEDED:
            return {
                ...state,
                accounts: state.accounts.filter((account) => {
                    return account.id.toString() !== action.accountId.toString()
                })
            }
        case RECEIVE_ACCOUNT_TYPES:
            return {
                ...state,
                accountTypes: action.accountTypes
            }
        case RECEIVE_ACCOUNT_BALANCES_DATA:
            return {
                ...state,
                accountBalances: action.accountBalances,
            }
        case DELETE_ACCOUNT_BALANCE_SUCCEEDED:
            const accountBalanceId = action.id
            return {
                ...state,
                accountBalances: state.accountBalances.map(accountBalance => {
                    return {
                        ...accountBalance,
                        balances: accountBalance.balances.filter(balance => {
                            return balance.id.toString() !== accountBalanceId
                        })
                    }
                })
            }
        default:
            return state
    }
}

export default accounts