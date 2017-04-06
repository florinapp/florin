import React, { Component } from 'react'
import AccountListPanel from '../../containers/accounts/AccountListPanel'
import TransactionsPanel from '../../containers/accounts/TransactionsPanel'

class Accounts extends Component {

    componentDidMount() {
        const {onLoad} = this.props
        onLoad.bind(this).call()
    }

    render() {
        return (
            <div>
                <AccountListPanel />
                <TransactionsPanel />
            </div>
        )
    }
}

export default Accounts