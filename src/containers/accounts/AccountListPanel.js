import { connect } from 'react-redux'
import AccountListPanel from '../../components/accounts/AccountListPanel'
import { fetchAccountsData, selectAccount } from '../../actions'
import { withRouter } from 'react-router'

const mapStateToProps = ({ accounts }) => {
    accounts = accounts.accounts
    let currentAccount = accounts.currentAccount
    return {
        accounts,
        currentAccount
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAccountsData: () => {
            dispatch(fetchAccountsData())
        },
        onAccountSelected: (accountId) => {
            dispatch(selectAccount(accountId))
        }
    }
}

// withRouter makes the `match` attribute available to the component
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountListPanel))