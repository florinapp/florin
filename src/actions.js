import moment from 'moment'
import fetch from 'isomorphic-fetch'
import querystring from 'querystring'

// ----------------------------------------------------------------------------
// Fetch assets chart data
export const REQUEST_ASSETS_CHART_DATA = 'REQUEST_ASSETS_CHART_DATA'
export const RECEIVE_ASSETS_CHART_DATA = 'RECEIVE_ASSETS_CHART_DATA'
export const requestAssetsChartData = () => {
    return {
        type: REQUEST_ASSETS_CHART_DATA
    }
}
export const receiveAssetsChartData = (json) => {
    return {
        type: RECEIVE_ASSETS_CHART_DATA,
        data: json,
        receivedAt: Date.now()
    }
}
export const fetchAssetsChartData = () => {
    return (dispatch) => {
        dispatch(requestAssetsChartData())
        return fetch('http://localhost:9000/api/charts/assets')
            .then(response => response.json())
            .then(json => dispatch(receiveAssetsChartData(json)))
    }
}

// ----------------------------------------------------------------------------
// Fetch account data
export const REQUEST_ACCOUNTS_DATA = 'REQUEST_ACCOUNTS_DATA'
export const RECEIVE_ACCOUNTS_DATA = 'RECEIVE_ACCOUNTS_DATA'
export const requestAccountsData = () => {
    return {
        type: REQUEST_ACCOUNTS_DATA
    }
}
export const receiveAccountsData = (json) => {
    return {
        type: RECEIVE_ACCOUNTS_DATA,
        accounts: json.accounts,
        receivedAt: Date.now()
    }
}
export const fetchAccountsData = () => {
    return (dispatch) => {
        dispatch(requestAccountsData())
        return fetch('http://localhost:9000/api/accounts')
            .then(response => response.json())
            .then(json => dispatch(receiveAccountsData(json)))
    }
}

// ----------------------------------------------------------------------------
// Fetch transactions

const buildDateRangeRequestParams = ({ currentDateRange }) => {
    const FORMAT = 'YYYY-MM-DD'
    if (currentDateRange === undefined) {
        return {}
    }

    const now = moment(moment.now())
    switch (currentDateRange) {
        case 'thisMonth':
            return {
                startDate: now.startOf('month').format(FORMAT),
                endDate: now.endOf('month').format(FORMAT)
            }
        case 'lastMonth':
            const lastMonth = moment(now - moment.duration(32, 'd'))
            return {
                startDate: lastMonth.startOf('month').format(FORMAT),
                endDate: lastMonth.endOf('month').format(FORMAT)
            }
        case 'thisYear':
            return {
                startDate: now.startOf('year').format(FORMAT),
                endDate: now.endOf('year').format(FORMAT)
            }
        default:
            return {}
    }
}

const buildPaginationRequestParams = ({ currentPage }) => {
    return {
        page: currentPage
    }
}

const buildRequestParams = (filter, pagination) => {
    const builders = [
        buildDateRangeRequestParams,
        ({ onlyUncategorized }) => ({ onlyUncategorized }),
        ({ includeInternalTransfer }) => ({ includeInternalTransfer }),
        buildPaginationRequestParams,
    ]
    let params = builders.reduce((params, fn) => (
        {
            ...params,
            ...fn(params)
        }
    ), {...filter, ...pagination})
    console.log(params)
    return params
}

export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS'
export const requestTransactions = (accountId) => {
    return {
        type: REQUEST_TRANSACTIONS,
        accountId
    }
}
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'
export const receiveTransactions = (json) => {
    return {
        type: RECEIVE_TRANSACTIONS,
        transactions: json.transactions,
        pagination: {
            currentPage: json.current_page,
            totalPages: json.total_pages
        },
        receivedAt: Date.now()
    }
}
export const fetchTransactions = (accountId, filter, pagination) => {
    let url = `http://localhost:9000/api/accounts/${accountId}`
    const params = querystring.stringify(buildRequestParams(filter, pagination))
    url = `${url}?${params}`
    return (dispatch) => {
        // TODO: following doesn't work
        // if (accountId === null || accountId === undefined) {
        //     return dispatch(receiveTransactions({transactions: []}))
        // }
        dispatch(requestTransactions(accountId))
        return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(receiveTransactions(json)))
    }
}

// ----------------------------------------------------------------------------
// Fetch categories
export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES'
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES'
export const requestCategories = () => {
    return {
        type: REQUEST_CATEGORIES,
    }
}
export const receiveCategories = (json) => {
    return {
        type: RECEIVE_CATEGORIES,
        categories: json.categories,
        receivedAt: Date.now()
    }
}
export const fetchCategories = () => {
    return (dispatch) => {
        dispatch(requestCategories())
        return fetch(`http://localhost:9000/api/categories`)
            .then(response => response.json())
            .then(json => dispatch(receiveCategories(json)))
    }
}

// ----------------------------------------------------------------------------
// Update transaction
export const REQUEST_UPDATE_TRANSACTION = 'REQUEST_UPDATE_TRANSACTION'
export const UPDATE_TRANSACTION_SUCCEEDED = 'UPDATE_TRANSACTION_SUCCEEDED'
export const requestUpdateTransaction = (transactionId, transactionData) => {
    return {
        type: REQUEST_UPDATE_TRANSACTION,
        transactionId,
        transactionData
    }
}
export const updateTransactionSucceeded = (json) => {
    return {
        type: UPDATE_TRANSACTION_SUCCEEDED,
        transaction: json.transactions[0],
        receivedAt: Date.now()
    }
}

export const updateTransaction = (transactionId, transactionData) => {
    return (dispatch) => {
        dispatch(requestUpdateTransaction(transactionId, transactionData))
        let headers = new Headers()
        headers.set("Content-Type", "application/json")
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(transactionData)
        }
        return fetch(`http://localhost:9000/api/transactions/${transactionId}`, options)
            .then(response => response.json())
            .then(json => dispatch(updateTransactionSucceeded(json)))
    }
}

// ----------------------------------------------------------------------------
// Delete transaction
export const REQUEST_DELETE_TRANSACTION = 'REQUEST_DELETE_TRANSACTION '
export const DELETE_TRANSACTION_SUCCEEDED = 'DELETE_TRANSACTION_SUCCEEDED'
export const requestDeleteTransaction = (transactionId) => {
    return {
        type: REQUEST_DELETE_TRANSACTION,
        transactionId
    }
}

export const deleteTransactionSucceeded = (transactionId) => {
    return {
        type: DELETE_TRANSACTION_SUCCEEDED,
        transactionId
    }
}

export const deleteTransaction = (transactionId) => {
    return (dispatch) => {
        dispatch(requestDeleteTransaction(transactionId))
        const options = {
            method: 'DELETE',
        }
        return fetch(`http://localhost:9000/api/transactions/${transactionId}`, options)
            .then(response => response.json())
            .then(json => dispatch(deleteTransactionSucceeded(transactionId)))
    }
}

// ----------------------------------------------------------------------------
// Flag transaction as internal transfer
export const REQUEST_FLAG_AS_INTERNAL_TRANSACTION = 'REQUEST_FLAG_AS_INTERNAL_TRANSACTION'
export const FLAG_AS_INTERNAL_TRANSACTION_SUCCEEDED = 'FLAG_AS_INTERNAL_TRANSACTION_SUCCEEDED'
export const requestFlagAsInternalTransaction = (transactionId) => {
    return {
        type: REQUEST_FLAG_AS_INTERNAL_TRANSACTION,
        transactionId
    }
}

export const flagAsInternalTransactionSucceeded = (transactionId) => {
    return {
        type: FLAG_AS_INTERNAL_TRANSACTION_SUCCEEDED,
        transactionId
    }
}

export const flagAsInternalTransaction = (transactionId) => {
    return (dispatch) => {
        dispatch(requestFlagAsInternalTransaction(transactionId))
        let headers = new Headers()
        headers.set("Content-Type", "application/json")
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                category_id: 65534
            })
        }
        return fetch(`http://localhost:9000/api/transactions/${transactionId}`, options)
            .then(response => response.json())
            .then(json => dispatch(flagAsInternalTransactionSucceeded(transactionId)))
    }
}

// ----------------------------------------------------------------------------
// Fetch Category Summary
export const REQUEST_CATEGORY_SUMMARY = 'REQUEST_CATEGORY_SUMMARY'
export const RECEIVE_CATEGORY_SUMMARY = 'RECEIVE_CATEGORY_SUMMARY'
export const requestCategorySummary = () => {
    return {
        type: REQUEST_CATEGORY_SUMMARY,
    }
}
export const receiveCategorySummary = (json) => {
    return {
        type: RECEIVE_CATEGORY_SUMMARY,
        categorySummary: json.categorySummary,
        receivedAt: Date.now()
    }
}
export const fetchCategorySummary = (accountId, filter) => {
    const params = querystring.stringify(buildDateRangeRequestParams(filter))
    return (dispatch) => {
        dispatch(requestCategorySummary())
        return fetch(`http://localhost:9000/api/accounts/${accountId}/categorySummary?${params}`)
            .then(response => response.json())
            .then(json => dispatch(receiveCategorySummary(json)))
    }
}

// ----------------------------------------------------------------------------
// Transaction Pagination Change
export const CHANGE_TRANSACTION_PAGE_NUMBER = 'CHANGE_TRANSACTION_PAGE_NUMBER'
export const changeTransactionPage = (page) => {
    return {
        type: CHANGE_TRANSACTION_PAGE_NUMBER,
        page
    }
}

// ----------------------------------------------------------------------------
// Force Refresh Category Summary
export const FORCE_REFRESH_CATEGORY_SUMMARY = 'FORCE_REFRESH_CATEGORY_SUMMARY'
export const forceRefreshCategorySummary = () => {
    return {
        type: FORCE_REFRESH_CATEGORY_SUMMARY,
    }
}