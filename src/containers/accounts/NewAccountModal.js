import { connect } from 'react-redux'
import NewAccountModal from '../../components/accounts/NewAccountModal'
import { createAccount } from '../../actions'

const mapDispatchToProps = (dispatch) => {
    return {
        saveNewAccount: (account) => {
            dispatch(createAccount({account}))
        },
        validate: ({institution, name, type}) => {
            let result = {
                institutionNameValidationState: (institution || "").length >= 1 ? 'success' : 'error',
                accountNameValidationState: (name || "").length >= 1 ? 'success' : 'error',
                accountTypeValidationState: (type || "").length >= 1 ? 'success' : 'error',
            }
            result.isValid = (
                result.institutionNameValidationState === 'success'
                && result.accountNameValidationState === 'success'
                && result.accountTypeValidationState === 'success'
            )
            return result
        },
    }
}

export default connect(null, mapDispatchToProps)(NewAccountModal)