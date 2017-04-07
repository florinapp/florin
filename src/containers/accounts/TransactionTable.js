import { connect } from 'react-redux'
import TransactionTable from '../../components/accounts/TransactionTable'

const mapStateToProps = (state) => {
    const { transactions } = state.accounts
    return {
        transactions
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClicked: (transactionId) => {
            console.log('deleting ' + transactionId)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionTable)