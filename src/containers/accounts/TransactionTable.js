import { connect } from 'react-redux'
import TransactionTable from '../../components/accounts/TransactionTable'
import { deleteTransaction, flagAsInternalTransaction } from '../../actions'

const mapStateToProps = (state) => {
    const { accounts, ui } = state
    const { transactions, currentAccountId, filter } = accounts
    const { loadingTransactions } = ui
    return {
        transactions,
        loadingTransactions,
        currentAccountId,
        filter,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClicked: (transactionId) => {
            dispatch(deleteTransaction(transactionId))
        },
        onFlagAsInternalTransferClicked: (transactionId) => {
            dispatch(flagAsInternalTransaction(transactionId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionTable)