import {
    REQUEST_ACCOUNTS_DATA,
    RECEIVE_ACCOUNTS_DATA,
    REQUEST_CATEGORY_SUMMARY,
    RECEIVE_CATEGORY_SUMMARY,
} from '../actions'

const initState = {
    loadingAccountsData: false,
    loadingCategorySummary: false
}

const ui = (state=initState, action) => {
    switch (action.type) {
        case REQUEST_ACCOUNTS_DATA:
            return {
                ...state,
                loadingAccountsData: true
            }
        case RECEIVE_ACCOUNTS_DATA:
            return {
                ...state,
                loadingAccountsData: false
            }
        case REQUEST_CATEGORY_SUMMARY:
            return {
                ...state,
                loadingCategorySummary: true
            }
        case RECEIVE_CATEGORY_SUMMARY:
            return {
                ...state,
                loadingCategorySummary: false
            }
        default:
            return state
    }
}

export default ui;