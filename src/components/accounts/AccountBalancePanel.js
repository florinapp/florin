import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'

class AccountBalancePanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false
        }
    }

    render() {
        const header = (
            <h3>
                Account Balances
            </h3>
        )

        return (
            <div className="col-lg-9 col-md-6">
                <Panel header={header}>
                    hahaha
                    {this.state.collapsed}
                </Panel>
            </div>
        )
    }
}

export default AccountBalancePanel
