import React, { Component } from 'react'
import AccountListPanel from '../../containers/accounts/AccountListPanel'
import TransactionsPanel from '../../containers/accounts/TransactionsPanel'
import AccountBalancePanel from '../../containers/accounts/AccountBalancePanel'
import CategorySummaryPanel from '../../containers/accounts/CategorySummaryPanel'
import FlashMessage from '../../containers/FlashMessage'

class Accounts extends Component {

    componentDidMount() {
        const {onLoad} = this.props
        onLoad.bind(this).call()
    }

    render() {
        return (
            <div>
                <FlashMessage />
                <div className="col-lg-3 col-md-6">
                    <AccountListPanel />
                    <AccountBalancePanel />
                </div>
                <div className="col-lg-9 col-md-6">
                    <CategorySummaryPanel />
                    <TransactionsPanel />
                </div>
            </div>
        )
    }
}

export default Accounts