import { connect } from 'react-redux'
import TransactionsPanel from '../../components/accounts/TransactionsPanel'
import { withRouter } from 'react-router'
import { fetchTransactions } from '../../actions'
import request from 'superagent'  // TODO: use isomorphic-fetch


const mapStateToProps = ({accounts}) => {
    const {currentAccountId, filter, transactions} = accounts
    return {
        transactions,
        currentAccountId,
        filter
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
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionsPanel))