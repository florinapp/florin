import { connect } from 'react-redux'
import TotalAssetsChart from '../../components/dashboard/TotalAssetsChart'
import { fetchAccountBalancesChartData } from '../../actions'

const mapStateToProps = ({dashboard}) => {
    const {accountBalancesChartData, currentDateRange} = dashboard
    return {
        currentDateRange,
        accountBalancesChartData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDateRangeChange: (dateRange) => {
            dispatch(fetchAccountBalancesChartData(dateRange))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalAssetsChart)