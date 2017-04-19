import { connect } from 'react-redux'
import UploadTransactionsModal from '../../components/accounts/UploadTransactionsModal'
import { changeLinkAccount, closeUploadModal, uploadTransactions } from '../../actions'

const mapStateToProps = ({ ui, accounts }) => {
    const { uploadModal } = ui
    return {
        ...uploadModal,
        accounts: accounts.accounts,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => {
            dispatch(closeUploadModal())
        },
        onDrop: (files) => {
            dispatch(uploadTransactions(files))
        },
        onAccountChange: (accountId) => {
            dispatch(changeLinkAccount(accountId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadTransactionsModal)