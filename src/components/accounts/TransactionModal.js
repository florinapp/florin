import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'
import FieldGroup from '../FieldGroup'

class TransactionModal extends Component {

    render() {
        const title = 'New Transaction'
        const { show, onClose } = this.props
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FieldGroup id="payee" type="text" label="Payee" autoFocus />
                        <FieldGroup id="info" type="text" label="Info" />
                        <FieldGroup id="amount" type="text" label="Amount" />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary">Save</Button>
                    <Button onClick={()=> {
                        onClose()
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default TransactionModal