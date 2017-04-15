// QueryString Generator

const q = (...dicts) => {
    const params = dicts.reduce((aggregated, current) => {
        return {
            ...aggregated,
            ...current
        }
    }, {})
    return Object.keys(params).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
}

export default q