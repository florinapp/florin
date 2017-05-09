import { connect } from 'react-redux'
import AccountsTable from '../../components/dashboard/AccountsTable'
import { fetchAccountBalancesData, changeDashboardSelectedAccount } from '../../actions'

const mapStateToProps = ({dashboard}) => {
    const { accountBalances, currentAccountId } = dashboard
    return {
        accountBalances,
        currentAccountId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: () => {
            dispatch(fetchAccountBalancesData())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsTable)