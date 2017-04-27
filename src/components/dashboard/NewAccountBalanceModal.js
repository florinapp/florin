import React, { Component } from 'react'
import { Button, Modal, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css';

class NewAccountBalanceModal extends Component {
    constructor(props) {
        super(props)
        this.initState = {
            date: moment(),
            balanceValidationState: null,
            success: null
        }
        this.state = {
            ...this.initState
        }
    }

    resetFormState() {
        this.setState({balanceValidationState: null})
        this.balanceElement.value = ''
    }

    resetInitState() {
        this.balanceElement.value = ''
        this.setState(this.initState)
    }

    onChange(date) {
        this.setState({
            date
        })
    }

    validate(date, balance) {
        const isValidBalance = !Number.isNaN(balance)
        const validationState = isValidBalance ? 'success' : 'error'
        this.setState({
            balanceValidationState: validationState
        })
        return isValidBalance
    }

    render() {
        const { show, onClose, createAccountBalance } = this.props
        const { success } = this.state
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>New Account Balance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { success ? <Alert bsStyle="success">New balance recorded!</Alert> : ""}
                    <form>
                        <FormGroup controlId="date">
                            <ControlLabel>Date</ControlLabel>
                            <div>
                            <DatePicker
                                dateFormat="YYYY/MM/DD"
                                className="form-control"
                                selected={this.state.date}
                                onChange={(date) => {this.onChange(date)}}
                            />
                            </div>
                        </FormGroup>
                        <FormGroup controlId="balance"
                                   validationState={this.state.balanceValidationState}>
                            <ControlLabel>Balance</ControlLabel>
                            <FormControl
                                placeholder="Balance"
                                inputRef={(node) => this.balanceElement = node}
                            ></FormControl>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => {
                        let date = this.state.date.format('YYYY-MM-DD')
                        let balance = this.balanceElement.value
                        balance = Number.parseFloat(balance) 
                        if (this.validate(date, balance)) {
                            createAccountBalance(date, balance)
                            this.setState({success: true})
                            this.resetFormState()
                        }
                    }}>
                        Save
                    </Button>
                    <Button
                        bsStyle="default"
                        onClick={() => {
                            this.resetInitState()
                            onClose()
                        }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default NewAccountBalanceModal