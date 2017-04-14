import { connect } from 'react-redux'
import AccountListPanel from '../../components/accounts/AccountListPanel'
import { fetchAccountsData } from '../../actions'
import { withRouter } from 'react-router'

const mapStateToProps = ({ ui, accounts, currentAccountId }) => {
    accounts = accounts.accounts
    return {
        accounts,
        currentAccountId,
        requestAccountsData: ui.requestAccountsData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAccountsData: () => {
            dispatch(fetchAccountsData())
        }
    }
}

// withRouter makes the `match` attribute available to the component
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountListPanel))