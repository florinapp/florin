import { connect } from 'react-redux'
import AccountOverview from '../../components/dashboard/AccountOverview'
import { fetchAccountsData } from '../../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        onComponentMount: () => {
            dispatch(fetchAccountsData())
        }
    }
}

export default connect(null, mapDispatchToProps)(AccountOverview)