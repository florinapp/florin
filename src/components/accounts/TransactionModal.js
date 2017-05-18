import React from 'react'
import { Modal } from 'react-bootstrap'

class TransactionModal extends Component {

    render() {
        const title = 'New Transaction'
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
            </Modal>
        )
    }
}

export default TransactionModal