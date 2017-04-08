import { connect } from 'react-redux'
import CategoryChartPanel from '../../components/accounts/CategoryChartPanel'
import { fetchCategorySummary } from '../../actions'

const mapStateToProps = ({ accounts }) => {
    const { currentAccountId, filter, categorySummary } = accounts
    return {
        currentAccountId,
        filter,
        categorySummary
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCategorySummary: (accountId/*, filter*/) => {
            dispatch(fetchCategorySummary(accountId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryChartPanel)