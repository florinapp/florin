import React, { Component } from 'react'
import { Button, Modal, ControlLabel, FormControl, HelpBlock, FormGroup } from 'react-bootstrap'

const FieldGroup = ({id, label, help, validationState, ...props}) => {
    return (
        <FormGroup controlId={id} validationState={validationState}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    )
}

class NewAccountModal extends Component {
    resetValidationState() {
        this.setState({
            institutionNameValidationState: null,
            accountNameValidationState: null,
            accountTypeValidationState: null,
        })
    }

    componentWillMount() {
        this.resetValidationState()
    }

    render() {
        const { show, saveNewAccount, closeDialog, validate } = this.props
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Add New Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FieldGroup id="institution-name"
                                    type="text"
                                    label="Institution Name"
                                    placeholder="Institution Name"
                                    autoFocus
                                    validationState={this.state.institutionNameValidationState}
                                    inputRef={(node) => { this.institutionNameElement = node }} />
                        <FieldGroup id="account-name"
                                    type="text"
                                    label="Account Name"
                                    placeholder="Account Name"
                                    validationState={this.state.accountNameValidationState}
                                    inputRef={(node) => { this.accountNameElement = node }} />
                        <FormGroup controlId="account-type" validationState={this.state.accountTypeValidationState}>
                            <ControlLabel>Account Type</ControlLabel>
                            <FormControl componentClass="select"
                                         placeholder="Type"
                                         inputRef={(node) => { this.accountTypeNode = node }}>
                                <option value="chequing">Chequing</option>
                                <option value="savings">Savings</option>
                                <option value="credit">Credit Card</option>
                            </FormControl>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => {
                        const institutionName = this.institutionNameElement.value
                        const accountName = this.accountNameElement.value
                        const accountType = this.accountTypeNode.value
                        const newAccount = {institutionName, accountName, accountType}
                        const validationResult = validate(newAccount)
                        this.setState({
                            ...this.state,
                            ...validationResult
                        })
                        if (validationResult.isValid) {
                            saveNewAccount(newAccount)
                        }
                    }}>Save</Button>
                    <Button onClick={
                        () => {
                            this.resetValidationState()
                            closeDialog()
                        }
                    }>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default NewAccountModal