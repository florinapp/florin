import React, { Component }  from 'react'
import { Modal, Button, Alert, FormControl, ControlLabel, FormGroup, Form } from 'react-bootstrap'
import Dropzone from 'react-dropzone'

class UploadTransactionsModalDialog extends Component {
    render() {
        const { show, errorMessage, onClose, onDrop, uploadComplete } = this.props
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Upload Transactions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {errorMessage !== null ? <Alert bsStyle="danger">{errorMessage}</Alert> : ""}
                    </div>
                    <div className="row">
                        <Dropzone onDrop={(files) => onDrop(files)} multiple={false}>
                            <div style={{margin: "10px"}}>
                                <i className="fa fa-upload" aria-hidden="true" style={{fontSize: "96px"}}></i>
                                <div>Only OFX/QFX files are accepted at this moment</div>
                            </div>
                        </Dropzone>
                    </div>
                    {uploadComplete ?
                        <div className="row">
                            <Form>
                                <FormGroup controlId="associated-account" style={{margin: "5px"}}>
                                    <ControlLabel>Associate With An Existing Account Or Create A New One</ControlLabel>
                                    <FormControl componentClass="select" placeholder="Account">
                                        <option value="chequing">Chequing</option>
                                        <option value="savings">Savings</option>
                                        <option value="credit">Credit Card</option>
                                        <option value="credit">New Account...</option>
                                    </FormControl>
                                </FormGroup>
                            </Form>
                        </div>
                    : ""}
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary">Import Transactions</Button>
                    <Button onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default UploadTransactionsModalDialog