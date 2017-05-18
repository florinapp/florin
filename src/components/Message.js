import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'

class Message extends Component {
    constructor() {
        super()
        this.state = {
            visible: true
        }
    }

    render() {
        if (this.state.visible) {
            return (
                <div className="container">
                    <Alert bsStyle="danger" onDismiss={() => this.handleAlertDismiss()}>
                        <p>Unable to fetch account data</p>
                    </Alert>
                </div>
            )
        }
        return <div></div>
    }

    handleAlertDismiss() {
        this.setState({visible: false})
    }
}

export default Message