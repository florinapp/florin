import { RECEIVE_ACCOUNTS_DATA, ACCOUNT_SELECTED } from '../actions'

const initState = {
    currentAccount: null,
    accounts: []
}

const accounts = (state=initState, action) => {
    switch (action.type) {
        case RECEIVE_ACCOUNTS_DATA:
            return {
                ...state,
                accounts: action.accounts
            }
        case ACCOUNT_SELECTED:
            return {
                ...state,
                currentAccount: action.accountId
            }
        default:
            return state
    }
}

export default accounts