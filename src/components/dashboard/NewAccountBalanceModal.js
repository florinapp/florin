import React, { Component } from 'react'
import { Button, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css';

class NewAccountBalanceModal extends Component {
    constructor(props) {
        super(props)
        this.initState = {
            date: moment(),
            balanceValidationState: null
        }
        this.state = {
            ...this.initState
        }
    }

    resetState() {
        this.setState(this.initState)
    }

    onChange(date) {
        console.log(date)
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
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>New Account Balance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                            this.resetState()
                        }
                    }}>
                        Save
                    </Button>
                    <Button
                        bsStyle="default"
                        onClick={() => {
                            this.resetState()
                            onClose()
                        }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default NewAccountBalanceModal