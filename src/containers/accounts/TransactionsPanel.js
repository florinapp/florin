import { connect } from 'react-redux'
import TransactionsPanel from '../../components/accounts/TransactionsPanel'
import { withRouter } from 'react-router'
import { fetchTransactions } from '../../actions'

const mapStateToProps = ({accounts}) => {
    const {currentAccountId, transactions} = accounts
    return {
        transactions,
        currentAccountId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTransactions: (accountId) => {
            dispatch(fetchTransactions(accountId))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionsPanel))