import {
    REQUEST_ACCOUNTS_DATA,
    RECEIVE_ACCOUNTS_DATA,
} from '../actions'

const initState = {
    requestAccountsData: false,
    requestCategories: false
}

const ui = (state=initState, action) => {
    switch (action.type) {
        case REQUEST_ACCOUNTS_DATA:
            return {
                ...state,
                requestAccountsData: true
            }
        case RECEIVE_ACCOUNTS_DATA:
            return {
                ...state,
                requestAccountsData: false
            }
        default:
            return state
    }
}

export default ui;