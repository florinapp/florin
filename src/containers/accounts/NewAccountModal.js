import { connect } from 'react-redux'
import NewAccountModal from '../../components/accounts/NewAccountModal'
import { closeNewAccountModal, createAccount } from '../../actions'

const mapStateToProps = ({ ui }) => {
    return {
        show: ui.showNewAccountModal,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveNewAccount: (account) => {
            dispatch(createAccount(account))
        },
        validate: ({institutionName, accountName, accountType}) => {
            let result = {
                institutionNameValidationState: (institutionName || "").length >= 1 ? 'success' : 'error',
                accountNameValidationState: (accountName || "").length >= 1 ? 'success' : 'error',
                accountTypeValidationState: (accountType || "").length >= 1 ? 'success' : 'error',
            }
            result.isValid = (
                result.institutionNameValidationState === 'success'
                && result.accountNameValidationState === 'success'
                && result.accountTypeValidationState === 'success'
            )
            return result
        },
        closeDialog: () => {
            dispatch(closeNewAccountModal())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAccountModal)