import { connect } from 'react-redux'
import CategoryChartPanel from '../../components/accounts/CategoryChartPanel'

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

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryChartPanel)