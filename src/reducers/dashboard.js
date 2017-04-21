import { RECEIVE_ASSETS_CHART_DATA, RECEIVE_ACCOUNTS_DATA } from '../actions'

const initState = {
    accounts: []
}

const dashboard = (state=initState, action) => {
    switch (action.type) {
        case RECEIVE_ASSETS_CHART_DATA:
            return {
                ...state,
                assets: action.data
            }
        case RECEIVE_ACCOUNTS_DATA:
            return {
                ...state,
                accounts: action.accounts
            }
        default:
            return state
    }
}

export default dashboard