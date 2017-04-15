import React, { Component } from 'react'
import { Button, Modal, ControlLabel, FormControl, HelpBlock, FormGroup } from 'react-bootstrap'

const FieldGroup = ({id, label, help, ...props}) => {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    )
}

class NewAccountModal extends Component {

    render() {
        const { show, saveNewAccount, closeDialog } = this.props
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Add New Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FieldGroup id="institution-name" type="text" label="Institution Name" placeholder="Institution Name" autoFocus />
                        <FieldGroup id="account-name" type="text" label="Account Name" placeholder="Account Name" />
                        <FormGroup controlId="account-type">
                            <ControlLabel>Account Type</ControlLabel>
                            <FormControl componentClass="select" placeholder="Type">
                                <option value="chequing">Chequing</option>
                                <option value="savings">Savings</option>
                                <option value="credit">Credit Card</option>
                            </FormControl>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => saveNewAccount() }>Save</Button>
                    <Button onClick={() => closeDialog() }>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default NewAccountModal