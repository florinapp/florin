import { connect } from 'react-redux'
import TotalAssetsChart from '../../components/dashboard/TotalAssetsChart'
import { fetchAssetsChartData } from '../../actions'

const mapStateToProps = ({dashboard}) => {
    return {
        assets: dashboard.assets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: () => {
            dispatch(fetchAssetsChartData())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalAssetsChart)