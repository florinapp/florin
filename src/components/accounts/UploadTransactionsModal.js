import React, { Component }  from 'react'
import { Modal, Button, Alert, FormControl, ControlLabel, FormGroup, Form } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import Select from 'react-select'

const generateAccountOptions = (accounts) => {
    let retval = accounts.map((account) => {
        return {
            value: account.id,
            label: `${account.institution} - ${account.name}`,
        }
    })
    return [...retval,  {value: 'NEW', label: 'Create New...'}]
}

const AccountSelect = ({accounts, selectedAccountId, onAccountChange}) => {
    return (
        <Select options={generateAccountOptions(accounts)}
            clearable={false}
            autosize={false}
            value={selectedAccountId}
            onChange={(option) => onAccountChange(option.value)}
        />
    )
}

class UploadTransactionsModalDialog extends Component {

    render() {
        const { show, errorMessage, onClose, onDrop, uploadComplete, accounts, selectedAccountId, onAccountChange } = this.props
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
                                <FormGroup controlId="associated-account" style={{margin: "15px"}}>
                                    <ControlLabel>Associate With An Existing Account Or Create A New One</ControlLabel>
                                    <AccountSelect accounts={accounts} selectedAccountId={selectedAccountId} onAccountChange={onAccountChange} />
                                </FormGroup>
                            </Form>
                        </div>
                    : ""}
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" disabled={selectedAccountId === null}>Import Transactions</Button>
                    <Button onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default UploadTransactionsModalDialog