import { connect } from 'react-redux'
import TransactionsPanel from '../../components/accounts/TransactionsPanel'
import { withRouter } from 'react-router'
import { fetchTransactions } from '../../actions'

const mapStateToProps = ({accounts}) => {
    const {currentAccountId, currentDateRange, transactions} = accounts
    return {
        transactions,
        currentAccountId,
        currentDateRange
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTransactions: (accountId, params) => {
            dispatch(fetchTransactions(accountId, params))
        },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionsPanel))