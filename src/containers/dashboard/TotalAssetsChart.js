import { connect } from 'react-redux'
import TotalAssetsChart from '../../components/dashboard/TotalAssetsChart'
import { fetchAccountBalancesData } from '../../actions'

const mapStateToProps = ({dashboard}) => {
    return {
        accountBalances: dashboard.accountBalances
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: () => {
            dispatch(fetchAccountBalancesData())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalAssetsChart)