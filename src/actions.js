import fetch from 'isomorphic-fetch'

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
export const fetchTransactions = (accountId) => {
    return (dispatch) => {
        // TODO: following doesn't work
        // if (accountId === null || accountId === undefined) {
        //     return dispatch(receiveTransactions({transactions: []}))
        // }
        dispatch(requestTransactions(accountId))
        return fetch(`http://localhost:9000/api/accounts/${accountId}`)
            .then(response => response.json())
            .then(json => dispatch(receiveTransactions(json)))
    }
}