import React, { Component } from 'react'
import AccountListPanel from '../../containers/accounts/AccountListPanel'
import TransactionsPanel from '../../containers/accounts/TransactionsPanel'
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
                </div>
                <TransactionsPanel />
            </div>
        )
    }
}

export default Accounts