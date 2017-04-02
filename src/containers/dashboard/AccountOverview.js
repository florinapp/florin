import { connect } from 'react-redux'
import AccountOverview from '../../components/dashboard/AccountOverview'
import { fetchAccountsData } from '../../actions'

const mapStateToProps = ({dashboard}) => {
    console.log(dashboard)
    let {accounts} = dashboard
    return {
        accounts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onComponentMount: () => {
            dispatch(fetchAccountsData())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountOverview)