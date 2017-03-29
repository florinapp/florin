import { connect } from 'react-redux'
import TotalAssetsChart from '../components/TotalAssetsChart'
import { fetchAssetsChartData } from '../actions'

const mapStateToProps = (state) => {
    return {

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