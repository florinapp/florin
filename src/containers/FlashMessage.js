import { connect } from 'react-redux'
import FlashMessage from '../components/FlashMessage'
import { clearFlashMessage } from '../actions'

const mapStateToProps = ({ ui }) => {
    const {flashMessage} = ui
    return {
        flashMessage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDismiss: () => {
            dispatch(clearFlashMessage())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage)