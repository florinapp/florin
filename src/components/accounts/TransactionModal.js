import React, { Component } from 'react'
import { Modal, Button, FormGroup, ControlLabel } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import FieldGroup from '../FieldGroup'

class TransactionModal extends Component {
    constructor() {
        super()
        this.state = {
            date: null
        }
    }

    onChange(date) {
        this.setState({
            date
        })
    }

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
                        <FormGroup controlId="date">
                            <ControlLabel>Date</ControlLabel>
                            <div>
                                <DatePicker
                                    dateFormat="YYYY/MM/DD"
                                    className="form-control"
                                    selected={this.state.date || null}
                                    onChange={(date) => {this.onChange(date)}}
                                />
                            </div>
                        </FormGroup>
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