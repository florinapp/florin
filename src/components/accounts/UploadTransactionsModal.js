import React, { Component }  from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import Dropzone from 'react-dropzone'

class UploadTransactionsModalDialog extends Component {
    render() {
        const { show, onClose, onDrop, uploadComplete, totalImported, totalSkipped } = this.props
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Upload Transactions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert bsStyle="info">
                        <span>
                            Total Transaction Imported: {totalImported}
                        </span>
                            <br/>
                        <span>
                            Total Transaction Skipped: {totalSkipped}
                        </span>
                    </Alert>
                    <div className="container">
                        <Dropzone onDrop={(files) => onDrop(files)}>
                            <div>Drag and Drop your transaction file here</div>
                        </Dropzone>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default UploadTransactionsModalDialog