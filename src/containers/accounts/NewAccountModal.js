import { connect } from 'react-redux'
import NewAccountModal from '../../components/accounts/NewAccountModal'

const mapStateToProps = ({ ui }) => {
    return {
        show: ui.showNewAccountModal,
    }
}
export default connect(mapStateToProps, null)(NewAccountModal)