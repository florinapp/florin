import { connect } from 'react-redux'
import AccountsTable from '../../components/dashboard/AccountsTable'

const mapStateToProps = ({dashboard}) => {
    const {accounts} = dashboard
    return {
        accounts
    }
}

export default connect(mapStateToProps, null)(AccountsTable)