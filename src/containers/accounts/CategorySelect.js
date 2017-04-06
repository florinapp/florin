import { connect } from 'react-redux'
import CategorySelect from '../../components/accounts/CategorySelect'

const mapStateToProps = (state) => {
    const { categories } = state
    return {
        categories
    }
}

export default connect(mapStateToProps, null)(CategorySelect)