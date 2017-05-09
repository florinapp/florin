import { connect } from 'react-redux'
import AccountBalancePanel from '../../components/accounts/AccountBalancePanel'
import { createAccountBalance, fetchAccountBalancesData, deleteAccountBalance } from '../../actions'

const mapStateToProps = ({accounts}) => {
    const { accountBalances, currentAccountId } = accounts
    return {
        accountBalances,
        currentAccountId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createAccountBalance: (accountId, date, balance) => {
            dispatch(createAccountBalance(accountId, date, balance))
        },
        fetchAccountBalancesData: () => {
            dispatch(fetchAccountBalancesData())
        },
        deleteAccountBalance: (accountId, id) => {
            dispatch(deleteAccountBalance(accountId, id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountBalancePanel)