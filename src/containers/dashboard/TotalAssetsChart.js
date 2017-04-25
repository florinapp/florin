import { connect } from 'react-redux'
import TotalAssetsChart from '../../components/dashboard/TotalAssetsChart'
import { fetchAccountBalancesChartData } from '../../actions'

const mapStateToProps = ({dashboard}) => {
    return {
        accountBalancesChartData: dashboard.accountBalancesChartData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: () => {
            dispatch(fetchAccountBalancesChartData())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalAssetsChart)