import { connect } from 'react-redux'
import TotalAssetsChart from '../components/TotalAssetsChart'
import { fetchAssetsChartData } from '../actions'

const mapStateToProps = ({dashboard}) => {
    return {
        data: dashboard.assets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: () => {
            dispatch(fetchAssetsChartData())
        },
        onLastMonth: () => {
            alert('last month')
        },
        onTwoMonthsAgo: () => {
            alert('two months ago')
        },
        onYearToDate: () => {
            alert('YTD')
        },
        onAllTime: () => {
            alert('all time')
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalAssetsChart)