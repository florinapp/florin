import { connect } from 'react-redux'
import CategorySummaryPanel from '../../components/accounts/CategorySummaryPanel'
import { fetchCategorySummary } from '../../actions'

const mapStateToProps = ({ accounts }) => {
    const { currentAccountId, filter, categorySummary, transactions } = accounts
    return {
        currentAccountId,
        filter,
        categorySummary,
        transactions
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCategorySummary: (accountId, filter={}) => {
            dispatch(fetchCategorySummary(accountId, filter))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategorySummaryPanel)