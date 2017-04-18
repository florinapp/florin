import React, { Component }  from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import Dropzone from 'react-dropzone'

class UploadTransactionsModalDialog extends Component {
    render() {
        const { show, errorMessage, onClose, onDrop, uploadComplete, totalImported, totalSkipped } = this.props
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Upload Transactions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage !== null ? <Alert bsStyle="danger">{errorMessage}</Alert> : ""}
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
                        <Dropzone onDrop={(files) => onDrop(files)} multiple={false}>
                            <div style={{margin: "10px"}}>
                                <i className="fa fa-upload" aria-hidden="true" style={{fontSize: "48px"}}></i>
                                &nbsp;
                                <span>Only OFX/QFX files are accepted at this moment</span>
                            </div>
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