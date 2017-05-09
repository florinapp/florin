import React, { Component } from 'react'
import AccountListPanel from '../../containers/accounts/AccountListPanel'
import TransactionsPanel from '../../containers/accounts/TransactionsPanel'
import AccountBalancePanel from '../../containers/accounts/AccountBalancePanel'
import CategorySummaryPanel from '../../containers/accounts/CategorySummaryPanel'

class Accounts extends Component {

    componentDidMount() {
        const {onLoad} = this.props
        onLoad.bind(this).call()
    }

    render() {
        return (
            <div>
                <div className="col-lg-3 col-md-6">
                    <AccountListPanel />
                    <CategorySummaryPanel />
                    <AccountBalancePanel />
                </div>
                <div className="col-lg-9 col-md-6">
                    <TransactionsPanel />
                </div>
            </div>
        )
    }
}

export default Accounts