import { connect } from 'react-redux'
import AccountEditModal from '../../components/accounts/AccountEditModal'

const mapDispatchToProps = (dispatch) => {
    return {
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

export default connect(null, mapDispatchToProps)(AccountEditModal)