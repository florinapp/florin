import { connect } from 'react-redux'
import TransactionsPanel from '../../components/accounts/TransactionsPanel'
import { withRouter } from 'react-router'
import { fetchTransactions, changeTransactionPage, showUploadModal } from '../../actions'


const mapStateToProps = ({accounts}) => {
    const {currentAccountId, filter, sort, transactions, pagination} = accounts
    return {
        transactions,
        currentAccountId,
        filter,
        sort,
        pagination
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTransactions: (accountId, filter, sort, pagination) => {
            dispatch(fetchTransactions(accountId, filter, sort, pagination))
        },
        onShowUploadModal: () => {
            dispatch(showUploadModal())
        },
        onPageClicked: (page) => {
            dispatch(changeTransactionPage(page))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionsPanel))