import { RECEIVE_CATEGORIES, REQUEST_CATEGORIES } from '../actions'

const initState = []

const categories = (state=initState, action) => {
    switch (action.type) {
        case RECEIVE_CATEGORIES:
            return action.categories
        default:
            return state
    }
}

export default categories