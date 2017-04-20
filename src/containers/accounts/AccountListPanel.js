import { connect } from 'react-redux'
import AccountListPanel from '../../components/accounts/AccountListPanel'
import { createAccount, updateAccount, fetchAccountsData } from '../../actions'
import { withRouter } from 'react-router'

const mapStateToProps = ({ ui, accounts, currentAccountId }) => {
    accounts = accounts.accounts
    return {
        accounts,
        currentAccountId,
        loadingAccountsData: ui.loadingAccountsData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAccountsData: () => {
            dispatch(fetchAccountsData())
        },
        saveNewAccount: (account) => {
            dispatch(createAccount({account}))
        },
        updateAccount: (accountId, account) => {
            dispatch(updateAccount(accountId, {account}))
        }
    }
}

// withRouter makes the `match` attribute available to the component
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountListPanel))