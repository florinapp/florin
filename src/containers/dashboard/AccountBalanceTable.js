import { connect } from 'react-redux'
import AccountBalanceTable from '../../components/dashboard/AccountBalanceTable'

const mapStateToProps = ({dashboard}) => {
    const { accountBalances, currentAccountId } = dashboard
    return {
        accountBalances,
        currentAccountId,
    }
}

export default connect(mapStateToProps, null)(AccountBalanceTable)