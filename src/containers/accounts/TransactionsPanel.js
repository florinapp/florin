import { connect } from 'react-redux'
import TransactionsPanel from '../../components/accounts/TransactionsPanel'
import { withRouter } from 'react-router'
import { fetchTransactions, changeTransactionPage } from '../../actions'
import request from 'superagent'  // TODO: use isomorphic-fetch


const mapStateToProps = ({accounts}) => {
    const {currentAccountId, filter, transactions, pagination} = accounts
    return {
        transactions,
        currentAccountId,
        filter,
        pagination
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTransactions: (accountId, params) => {
            dispatch(fetchTransactions(accountId, params))
        },
        uploadTransactionFile: (accountId, files, callback) => {
            const req = request.post(`http://localhost:9000/api/accounts/${accountId}/upload`)
            files.forEach((file) => {
                req.attach(file.name, file)
            })
            req.end(callback)
        },
        onPageClicked: (page) => {
            dispatch(changeTransactionPage(page))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionsPanel))