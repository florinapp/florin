import React, { Component } from 'react'
import { Button, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css';

class NewAccountBalanceModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: moment()
        }
    }

    onChange(date) {
        console.log(date)
        this.setState({
            date
        })
    }

    render() {
        const { show, onClose } = this.props
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
                        <FormGroup controlId="balance">
                            <ControlLabel>Balance</ControlLabel>
                            <FormControl placeholder="Balance" inputRef={(node) => this.balanceElement = node}>
                            </FormControl>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary">Save</Button>
                    <Button bsStyle="default" onClick={() => onClose()}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default NewAccountBalanceModal