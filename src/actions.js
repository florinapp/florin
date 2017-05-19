import fetch from 'isomorphic-fetch'
import querystring from 'querystring'
import request from 'superagent'  // TODO: use isomorphic-fetch
import { getDateRangeFilterByName } from './dateRangeFilters'

const API_BASE_URL = 'http://localhost:9000'

const unwrapJsonResponse = response => {
    return response.json()
}

const dispatchSuccessEvent = (dispatch, eventFactory) => {
    return (json) => {
        dispatch(eventFactory(json))
    }
}

const dispatchRequestFailedEvent = (dispatch, message) => {
    return (error) => {
        dispatch(requestFailed(message))
    }
}

// ----------------------------------------------------------------------------
// Error state
export const REQUEST_FAILED = 'REQUEST_FAILED'
export const requestFailed = (message) => {
    return {
        type: REQUEST_FAILED,
        message: message,
    }
}

export const CLEAR_FLASH_MESSAGE = 'CLEAR_FLASH_MESSAGE'
export const clearFlashMessage = () => {
    return {
        type: CLEAR_FLASH_MESSAGE,
    }
}

// ----------------------------------------------------------------------------
// Fetch account balances data
export const REQUEST_ACCOUNT_BALANCES_DATA = 'REQUEST_ACCOUNT_BALANCES_DATA'
export const RECEIVE_ACCOUNT_BALANCES_DATA = 'RECEIVE_ACCOUNT_BALANCES_DATA'
export const requestAccountBalancesData = () => {
    return {
        type: REQUEST_ACCOUNT_BALANCES_DATA
    }
}
export const receiveAccountBalancesData = (json) => {
    return {
        type: RECEIVE_ACCOUNT_BALANCES_DATA,
        accountBalances: json.accountBalances,
        receivedAt: Date.now()
    }
}
export const fetchAccountBalancesData = () => {
    return (dispatch) => {
        dispatch(requestAccountBalancesData())
        return fetch(`${API_BASE_URL}/api/accounts/_all/balances`)
            .then(response => response.json())
            .then(json => dispatch(receiveAccountBalancesData(json)))
    }
}

export const REQUEST_ACCOUNT_BALANCES_CHART_DATA = 'REQUEST_ACCOUNT_BALANCES_CHART_DATA'
export const requestAccountBalancesChartData = (dateRange) => {
    return {
        type: REQUEST_ACCOUNT_BALANCES_CHART_DATA,
        dateRange,
    }
}
export const RECEIVE_ACCOUNT_BALANCES_CHART_DATA = 'RECEIVE_ACCOUNT_BALANCES_CHART_DATA'
export const receiveAccountBalancesChartData = (json) => {
    return {
        type: RECEIVE_ACCOUNT_BALANCES_CHART_DATA,
        accountBalancesChartData: json.chartData,
        receivedAt: Date.now()
    }
}
export const fetchAccountBalancesChartData = (dateRange) => {
    return (dispatch) => {
        dispatch(requestAccountBalancesChartData(dateRange))
        const dateRangeFilter = buildDateRangeRequestParams({currentDateRange: dateRange})
        const params = querystring.stringify(dateRangeFilter)
        return fetch(`${API_BASE_URL}/api/charts/accountBalances?${params}`)
            .then(response => response.json())
            .then(json => dispatch(receiveAccountBalancesChartData(json)))
    }
}
// ----------------------------------------------------------------------------
// Change dashboard currently selected account
export const CHANGE_DASHBOARD_SELECTED_ACCOUNT = 'CHANGE_DASHBOARD_SELECTED_ACCOUNT'
export const changeDashboardSelectedAccount = (accountId) => {
    return {
        type: CHANGE_DASHBOARD_SELECTED_ACCOUNT,
        accountId,
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
        return fetch(`${API_BASE_URL}/api/accounts`)
            .then(unwrapJsonResponse)
            .then(dispatchSuccessEvent(dispatch, receiveAccountsData))
            .catch(dispatchRequestFailedEvent(dispatch, 'Unable to fetch accounts data'))
    }
}

// ----------------------------------------------------------------------------
// Fetch transactions

const buildDateRangeRequestParams = ({ currentDateRange }) => {
    if (currentDateRange === undefined) {
        return {}
    }

    const dateRangeFilter = getDateRangeFilterByName(currentDateRange)
    return dateRangeFilter.getDateRangeFilterParam()
}

const buildPaginationRequestParams = ({ currentPage }) => {
    return {
        page: currentPage || 1
    }
}

const buildRequestParams = (filter, sort, pagination) => {
    const builders = [
        buildDateRangeRequestParams,
        ({ onlyUncategorized }) => ({ onlyUncategorized }),
        ({ includeInternalTransfer }) => ({ includeInternalTransfer }),
        ({ orderBy }) => ({ orderBy }),
        buildPaginationRequestParams,
    ]
    let params = builders.reduce((params, fn) => (
        {
            ...params,
            ...fn(params)
        }
    ), {...filter, ...sort, ...pagination})
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
export const fetchTransactions = (accountId, filter, sort, pagination) => {
    let url = `${API_BASE_URL}/api/accounts/${accountId}`
    const params = querystring.stringify(buildRequestParams(filter, sort, pagination))
    url = `${url}?${params}`
    return (dispatch) => {
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
        return fetch(`${API_BASE_URL}/api/categories`)
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
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(transactionData)
        }
        return fetch(`${API_BASE_URL}/api/transactions/${transactionId}`, options)
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
        return fetch(`${API_BASE_URL}/api/transactions/${transactionId}`, options)
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
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                category_id: 65534
            })
        }
        return fetch(`${API_BASE_URL}/api/transactions/${transactionId}`, options)
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
        return fetch(`${API_BASE_URL}/api/accounts/${accountId}/categorySummary?${params}`)
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
// Create New Account
export const REQUEST_CREATE_ACCOUNT = 'REQUEST_CREATE_ACCOUNT'
export const requestCreateAccount = () => {
    return {
        type: REQUEST_CREATE_ACCOUNT 
    }
}
export const CREATE_ACCOUNT_SUCCEEDED = 'CREATE_ACCOUNT_SUCCEEDED'
export const createAccountSucceeded = (json) => {
    return {
        type: CREATE_ACCOUNT_SUCCEEDED,
        account: json.account,
        receivedAt: Date.now(),
    }
}
export const createAccount = (request) => {
    let headers = new Headers()
    headers.set("Content-Type", "application/json")
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(request)
    }
    return (dispatch) => {
        dispatch(requestCreateAccount())
        return fetch(`${API_BASE_URL}/api/accounts`, options)
            .then(response => response.json())
            .then(json => dispatch(createAccountSucceeded(json)))
    }
}

// ----------------------------------------------------------------------------
// Update Account
export const REQUEST_UPDATE_ACCOUNT = 'REQUEST_UPDATE_ACCOUNT'
export const requestUpdateAccount = () => {
    return {
        type: REQUEST_UPDATE_ACCOUNT
    }
}
export const UPDATE_ACCOUNT_SUCCEEDED = 'UPDATE_ACCOUNT_SUCCEEDED'
export const updateAccountSucceeded = (json) => {
    return {
        type: UPDATE_ACCOUNT_SUCCEEDED,
        account: json.account,
        receivedAt: Date.now(),
    }
}
export const updateAccount = (accountId, request) => {
    let headers = new Headers()
    headers.set("Content-Type", "application/json")
    const options = {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(request)
    }
    return (dispatch) => {
        dispatch(requestUpdateAccount())
        return fetch(`${API_BASE_URL}/api/accounts/${accountId}`, options)
            .then(response => response.json())
            .then(json => dispatch(updateAccountSucceeded(json)))
    }
}

// ----------------------------------------------------------------------------
// Delete Account
export const REQUEST_DELETE_ACCOUNT = 'REQUEST_DELETE_ACCOUNT'
export const requestDeleteAccount = () => {
    return {
        type: REQUEST_DELETE_ACCOUNT
    }
}
export const DELETE_ACCOUNT_SUCCEEDED = 'DELETE_ACCOUNT_SUCCEEDED'
export const deleteAccountSucceeded = (json) => {
    return {
        type: DELETE_ACCOUNT_SUCCEEDED,
        accountId: json.accountId,
        receivedAt: Date.now(),
    }
}
export const deleteAccount = (accountId) => {
    return (dispatch) => {
        dispatch(requestDeleteAccount())
        return fetch(`${API_BASE_URL}/api/accounts/${accountId}`, {method: 'DELETE'})
            .then(response => response.json())
            .then(json => dispatch(deleteAccountSucceeded(json)))
    }
}

// ----------------------------------------------------------------------------
// Upload Transaction Modal
export const SHOW_UPLOAD_MODAL = 'SHOW_UPLOAD_MODAL'
export const showUploadModal = () => {
    return {
        type: SHOW_UPLOAD_MODAL 
    }
}
export const CLOSE_UPLOAD_MODAL = 'CLOSE_UPLOAD_MODAL'
export const closeUploadModal = () => {
    return {
        type: CLOSE_UPLOAD_MODAL
    }
}
export const REQUEST_UPLOAD_TRANSACTIONS = 'REQUEST_UPLOAD_TRANSACTIONS'
export const requestUploadTransactions = () => {
    return {
        type: REQUEST_UPLOAD_TRANSACTIONS
    }
}
export const UPLOAD_TRANSACTIONS_SUCCEEDED = 'UPLOAD_TRANSACTIONS_SUCCEEDED'
export const uploadTransactionsSucceeded = (json) => {
    return {
        type: UPLOAD_TRANSACTIONS_SUCCEEDED,
        fileUpload: json,
    }
}
export const UPLOAD_TRANSACTIONS_FAILED = 'UPLOAD_TRANSACTIONS_FAILED'
export const uploadTransactionsFailed = ({error}) => {
    return {
        type: UPLOAD_TRANSACTIONS_FAILED,
        error,
    }
}

export const uploadTransactions = (files) => {
    return (dispatch) => {
        dispatch(requestUploadTransactions())
        // TODO: use isomorphic-fetch
        const req = request.post(`${API_BASE_URL}/api/fileUploads`)
        files.forEach((file) => {
            req.attach(file.name, file)
        })
        req.end((err, res) => {
            if (err !== null) {
                dispatch(uploadTransactionsFailed(res.body))
                return
            }
            dispatch(uploadTransactionsSucceeded(res.body))
        })
    }
}

export const CHANGE_LINK_ACCOUNT = 'CHANGE_LINK_ACCOUNT'
export const changeLinkAccount = (accountId) => {
    return {
        type: CHANGE_LINK_ACCOUNT,
        accountId,
    }
}

export const REQUEST_LINK_UPLOAD_WITH_ACCOUNT = 'REQUEST_LINK_UPLOAD_WITH_ACCOUNT'
export const requestLinkUploadWithAccount = () => {
    return {
        type: REQUEST_LINK_UPLOAD_WITH_ACCOUNT
    }
}
export const LINK_UPLOAD_WITH_ACCOUNT_SUCCEEDED = 'LINK_UPLOAD_WITH_ACCOUNT_SUCCEEDED'
export const linkUploadWithAccountSucceeded = (json) => {
    return {
        type: LINK_UPLOAD_WITH_ACCOUNT_SUCCEEDED,
        accountId: json.account_id,
        totalImported: json.total_imported,
        totalSkipped: json.total_skipped,
    }
}
export const linkUploadWithAccount = (fileUpload, selectedAccountId) => {
    return (dispatch) => {
        dispatch(requestLinkUploadWithAccount())
        let headers = new Headers()
        headers.set("Content-Type", "application/json")
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({accountId: selectedAccountId})
        }
        return fetch(`${API_BASE_URL}/api/fileUploads/${fileUpload.id}/linkAccount`, options)
            .then(response => response.json())
            .then(json => dispatch(linkUploadWithAccountSucceeded(json)))
    }
}

// ----------------------------------------------------------------------------
// Create New Account Balance
export const REQUEST_CREATE_ACCOUNT_BALANCE = 'REQUEST_CREATE_ACCOUNT_BALANCE'
export const requestCreateAccountBalance = () => {
    return {
        type: REQUEST_CREATE_ACCOUNT_BALANCE
    }
}
export const CREATE_ACCOUNT_BALANCE_SUCCEEDED = 'CREATE_ACCOUNT_BALANCE_SUCCEEDED'
export const createAccountBalanceSucceeded = (json) => {
    return {
        type: CREATE_ACCOUNT_BALANCE_SUCCEEDED,
        accountId: json.accountId,
        receivedAt: Date.now(),
    }
}
export const createAccountBalance = (accountId, date, balance) => {
    return (dispatch) => {
        dispatch(requestCreateAccountBalance())
        let headers = new Headers()
        headers.set("Content-Type", "application/json")
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({date, balance})
        }
        return fetch(`${API_BASE_URL}/api/accounts/${accountId}/balances`, options)
            .then(response => response.json())
            .then(json => dispatch(createAccountBalanceSucceeded(json)))
    }
}

// ----------------------------------------------------------------------------
// Delete Account Balance
export const REQUEST_DELETE_ACCOUNT_BALANCE = 'REQUEST_DELETE_ACCOUNT_BALANCE'
export const requestDeleteAccountBalance = () => {
    return {
        type: REQUEST_DELETE_ACCOUNT_BALANCE
    }
}
export const DELETE_ACCOUNT_BALANCE_SUCCEEDED = 'DELETE_ACCOUNT_BALANCE_SUCCEEDED'
export const deleteAccountBalanceSucceeded = (id) => {
    return {
        type: DELETE_ACCOUNT_BALANCE_SUCCEEDED,
        id,
    }
}

export const deleteAccountBalance = (accountId, id) => {
    return (dispatch) => {
        dispatch(requestDeleteAccountBalance())
        return fetch(`${API_BASE_URL}/api/accounts/${accountId}/balances/${id}`, {method: 'DELETE'})
            .then(response => response.json())
            .then(json => dispatch(deleteAccountBalanceSucceeded(id)))
    }
}

// ----------------------------------------------------------------------------
// Fetch Account Types
export const REQUEST_FETCH_ACCOUNT_TYPES = 'REQUEST_FETCH_ACCOUNT_TYPES'
export const requestFetchAccountTypes = () => {
    return {
        type: REQUEST_FETCH_ACCOUNT_TYPES 
    }
}
export const RECEIVE_ACCOUNT_TYPES = 'RECEIVE_ACCOUNT_TYPES'
export const receiveAccountTypes = (json) => {
    return {
        type: RECEIVE_ACCOUNT_TYPES,
        accountTypes: json.accountTypes,
        receivedAt: Date.now(),
    }
}
export const fetchAccountTypes = () => {
    return (dispatch) => {
        dispatch(requestFetchAccountTypes())
        return fetch(`${API_BASE_URL}/api/accountTypes`)
            .then(response => response.json())
            .then(json => dispatch(receiveAccountTypes(json)))
    }
}