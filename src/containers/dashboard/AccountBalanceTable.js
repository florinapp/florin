import { connect } from 'react-redux'
import AccountBalanceTable from '../../components/dashboard/AccountBalanceTable'
import { createAccountBalance, fetchAccountBalancesData, deleteAccountBalance } from '../../actions'

const mapStateToProps = ({dashboard}) => {
    const { accountBalances, currentAccountId } = dashboard
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountBalanceTable)