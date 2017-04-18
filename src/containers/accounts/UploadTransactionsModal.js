import { connect } from 'react-redux'
import UploadTransactionsModal from '../../components/accounts/UploadTransactionsModal'
import { closeUploadModal, uploadTransactions } from '../../actions'

const mapStateToProps = ({ ui, accounts }) => {
    const { uploadModal } = ui
    const { currentAccountId } = accounts
    return {
        ...uploadModal,
        currentAccountId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => {
            dispatch(closeUploadModal())
        },
        onDrop: (files) => {
            dispatch(uploadTransactions(files))
        }
        // uploadTransactionFile: (accountId, files, callback) => {
        //     const req = request.post(`http://localhost:9000/api/accounts/${accountId}/upload`)
        //     files.forEach((file) => {
        //         req.attach(file.name, file)
        //     })
        //     req.end(callback)
        // },
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(UploadTransactionsModal)