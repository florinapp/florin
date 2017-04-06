import React, { Component}  from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import Dropzone from 'react-dropzone'

// TODO: This component is managing too much state
// Consider migrate it to a container
class UploadTransactionsModalDialog extends Component {
    componentWillMount() {
        this.setState({
            uploadComplete: false,
            totalImported: 0,
            totalSkipped: 0
        })
    }

    render() {
        const { show, onClose, onUpload} = this.props
        const { uploadComplete, totalImported, totalSkipped } = this.state
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
                    <Dropzone onDrop={(files) => {
                        onUpload(files, (err, res) => {
                            const { totalImported, totalSkipped } = res.body
                            this.setState({
                                uploadComplete: true,
                                totalImported,
                                totalSkipped
                            })
                        })
                    }}>
                        <div>Drag and Drop your transaction file here</div>
                    </Dropzone>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default UploadTransactionsModalDialog