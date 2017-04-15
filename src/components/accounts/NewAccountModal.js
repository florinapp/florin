import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

class NewAccountModal extends Component {

    render() {
        const { show } = this.props
        return (
            <Modal show={show}>
            </Modal>
        )
    }
}

export default NewAccountModal