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
        data: json.data,
        receivedAt: Date.now()
    }
}
export const fetchAssetsChartData = () => {
    return (dispatch) => {
        dispatch(requestAssetsChartData())
        return fetch('http://localhost:9000/charts/assets')
            .then(response => response.json())
            .then(json => dispatch(receiveAssetsChartData(json)))
    }
}