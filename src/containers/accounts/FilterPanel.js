import { connect } from 'react-redux'
import FilterPanel from '../../components/accounts/FilterPanel'

const mapStateToProps = ({ accounts }) => {
    const { currentAccountId, filter } = accounts
    return {
        currentAccountId,
        filter
    }
}

export default connect(mapStateToProps, null)(FilterPanel)