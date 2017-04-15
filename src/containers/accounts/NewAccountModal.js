import { connect } from 'react-redux'
import NewAccountModal from '../../components/accounts/NewAccountModal'
import { closeNewAccountModal } from '../../actions'

const mapStateToProps = ({ ui }) => {
    return {
        show: ui.showNewAccountModal,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveNewAccount: () => {
            console.log('Save clicked')
        },
        closeDialog: () => {
            dispatch(closeNewAccountModal())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAccountModal)