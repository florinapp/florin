import { connect } from 'react-redux'
import UploadTransactionsModal from '../../components/accounts/UploadTransactionsModal'
import { fetchAccountsData, changeLinkAccount, closeUploadModal, uploadTransactions, linkUploadWithAccount } from '../../actions'

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
            dispatch(fetchAccountsData())
        },
        onDrop: (files) => {
            dispatch(uploadTransactions(files))
        },
        onAccountChange: (accountId) => {
            dispatch(changeLinkAccount(accountId))
        },
        onImportTransactions: (fileUpload, selectedAccountId) => {
            dispatch(linkUploadWithAccount(fileUpload, selectedAccountId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadTransactionsModal)