import { RECEIVE_ASSETS_CHART_DATA } from '../actions'

const initState = {}

const dashboard = (state=initState, action) => {
    switch (action.type) {
        case RECEIVE_ASSETS_CHART_DATA:
            return {
                ...state,
                assets: action.data
            }
        default:
            return state
    }
}

export default dashboard