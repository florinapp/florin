import { connect } from 'react-redux'
import Accounts from '../../components/accounts/Accounts'
import { fetchCategories } from '../../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        onLoad: () => {
            dispatch(fetchCategories())
        }
    }
}

export default connect(null, mapDispatchToProps)(Accounts)