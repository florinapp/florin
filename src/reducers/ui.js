import {
    REQUEST_ACCOUNTS_DATA,
    RECEIVE_ACCOUNTS_DATA,
    REQUEST_CATEGORY_SUMMARY,
    RECEIVE_CATEGORY_SUMMARY,
    REQUEST_TRANSACTIONS,
    RECEIVE_TRANSACTIONS,
    CREATE_ACCOUNT_SUCCEEDED,
    SHOW_UPLOAD_MODAL,
    CLOSE_UPLOAD_MODAL,
    UPLOAD_TRANSACTIONS_SUCCEEDED,
    UPLOAD_TRANSACTIONS_FAILED,
    CHANGE_LINK_ACCOUNT,
    LINK_UPLOAD_WITH_ACCOUNT_SUCCEEDED,
} from '../actions'

const initState = {
    loadingAccountsData: false,
    loadingCategorySummary: false,
    loadingTransactions: false,
    showNewAccountModal: false,
    uploadModal: {
        show: false,
        uploadComplete: false,
        fileUpload: null,
        totalImported: 0,
        totalSkipped: 0,
        errorMessage: null,
        selectedAccountId: null,  // Account selected from the UI
        importedAccountId: null,  // Account id the transactions imported into (deal with accountId = 'NEW' case)
        linkComplete: false,
    }
}

const ui = (state=initState, action) => {
    switch (action.type) {
        case REQUEST_ACCOUNTS_DATA:
            return {
                ...state,
                loadingAccountsData: true
            }
        case RECEIVE_ACCOUNTS_DATA:
            return {
                ...state,
                loadingAccountsData: false
            }
        case REQUEST_CATEGORY_SUMMARY:
            return {
                ...state,
                loadingCategorySummary: true
            }
        case RECEIVE_CATEGORY_SUMMARY:
            return {
                ...state,
                loadingCategorySummary: false
            }
        case REQUEST_TRANSACTIONS:
            return {
                ...state,
                loadingTransactions: true
            }
        case RECEIVE_TRANSACTIONS:
            return {
                ...state,
                loadingTransactions: false
            }
        case CREATE_ACCOUNT_SUCCEEDED:
            return {
                ...state,
                showNewAccountModal: false
            }
        case SHOW_UPLOAD_MODAL:
            return {
                ...state,
                uploadModal: {
                    ...state.uploadModal,
                    show: true
                }
            }
        case CLOSE_UPLOAD_MODAL:
            return {
                ...state,
                uploadModal: {
                    ...state.uploadModal,
                    show: false,
                    uploadComplete: false,
                    fileUpload: null,
                    totalImported: 0,
                    totalSkipped: 0,
                    errorMessage: null,
                    selectedAccountId: null,
                    importedAccountId: null,
                    linkComplete: false,
                }
            }
        case UPLOAD_TRANSACTIONS_SUCCEEDED:
            let selectedAccountId = state.uploadModal.selectedAccountId
            if (action.fileUpload.link.accountId && action.fileUpload.link.confidenceIndex >= 0.8) {
                selectedAccountId = action.fileUpload.link.accountId
            }
            return {
                ...state,
                uploadModal: {
                    ...state.uploadModal,
                    errorMessage: null,
                    uploadComplete: true,
                    fileUpload: action.fileUpload,
                    linkComplete: false,
                    selectedAccountId,
                }
            }
        case UPLOAD_TRANSACTIONS_FAILED:
            return {
                ...state,
                uploadModal: {
                    ...state.uploadModal,
                    errorMessage: action.error,
                    linkComplete: false,
                }
            }
        case CHANGE_LINK_ACCOUNT:
            return {
                ...state,
                uploadModal: {
                    ...state.uploadModal,
                    selectedAccountId: action.accountId,
                }
            }
        case LINK_UPLOAD_WITH_ACCOUNT_SUCCEEDED:
            return {
                ...state,
                uploadModal: {
                    ...state.uploadModal,
                    importedAccountId: action.accountId,
                    totalImported: action.totalImported,
                    totalSkipped: action.totalSkipped,
                    linkComplete: true,
                }
            }
        default:
            return state
    }
}

export default ui;