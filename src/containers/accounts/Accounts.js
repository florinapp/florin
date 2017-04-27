import { connect } from 'react-redux'
import Accounts from '../../components/accounts/Accounts'
import { fetchCategories, fetchAccountTypes } from '../../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(fetchCategories())
            dispatch(fetchAccountTypes())
        }
    }
}

export default connect(null, mapDispatchToProps)(Accounts)