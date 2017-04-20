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

class AccountEditModal extends Component {
    resetValidationState() {
        this.setState({
            institutionNameValidationState: null,
            accountNameValidationState: null,
            accountTypeValidationState: null,
        })
    }

    resetInputFields() {
        this.institutionNameElement.value = ""
        this.accountNameElement = ""
    }

    componentWillMount() {
        this.resetValidationState()
    }

    render() {
        const { show, mode, closeDialog, validate, onSaveClicked } = this.props
        const title = mode === "create" ? "Add New Account" : "Edit Account"
        let currentAccount = mode === "create" ? {} : (this.props.currentAccount || {})
        let buttonCaption = mode === "create" ? "Create" : "Update"
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FieldGroup id="institution-name"
                                    type="text"
                                    label="Institution Name"
                                    placeholder="Institution Name"
                                    autoFocus
                                    defaultValue={currentAccount.institution || null}
                                    validationState={this.state.institutionNameValidationState}
                                    inputRef={(node) => { this.institutionNameElement = node }} />
                        <FieldGroup id="account-name"
                                    type="text"
                                    label="Account Name"
                                    placeholder="Account Name"
                                    defaultValue={currentAccount.name || null}
                                    validationState={this.state.accountNameValidationState}
                                    inputRef={(node) => { this.accountNameElement = node }} />
                        <FormGroup controlId="account-type" validationState={this.state.accountTypeValidationState}>
                            <ControlLabel>Account Type</ControlLabel>
                            <FormControl componentClass="select"
                                         placeholder="Type"
                                         defaultValue={currentAccount.type}
                                         inputRef={(node) => { this.accountTypeNode = node }}>
                                {
                                    ['chequing', 'savings', 'credit'].map((type) => {
                                        return <option key={type} value={type} checked={currentAccount.type === type}>{type}</option>
                                    })
                                }
                            </FormControl>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => {
                        const institution = this.institutionNameElement.value
                        const name = this.accountNameElement.value
                        const type = this.accountTypeNode.value
                        const newAccount = {institution, name, type}
                        const validationResult = validate(newAccount)
                        this.setState({
                            ...this.state,
                            ...validationResult
                        })
                        if (validationResult.isValid) {
                            onSaveClicked(newAccount)
                            this.resetValidationState()
                            this.resetInputFields()
                            closeDialog()
                        }
                    }}>{buttonCaption}</Button>
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

export default AccountEditModal