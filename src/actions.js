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
        receivedAt: Date.now()
    }
}
export const fetchTransactions = (accountId, params={}) => {
    let url = `http://localhost:9000/api/accounts/${accountId}`
    params = querystring.stringify(params)
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