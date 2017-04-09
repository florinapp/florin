import { connect } from 'react-redux'
import TransactionTable from '../../components/accounts/TransactionTable'
import { deleteTransaction, flagAsInternalTransfer } from '../../actions'

const mapStateToProps = (state) => {
    const { transactions } = state.accounts
    return {
        transactions
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClicked: (transactionId) => {
            dispatch(deleteTransaction(transactionId))
        },
        onFlagAsInternalTransferClicked: (transactionId) => {
            dispatch(flagAsInternalTransfer(transactionId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionTable)