import { connect } from 'react-redux'
import AccountListPanel from '../../components/accounts/AccountListPanel'
import { fetchAccountsData, selectAccount } from '../../actions'

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

export default connect(mapStateToProps, mapDispatchToProps)(AccountListPanel)