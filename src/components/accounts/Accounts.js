import React, { Component } from 'react'
import AccountListPanel from '../../containers/accounts/AccountListPanel'
import TransactionsPanel from '../../containers/accounts/TransactionsPanel'
import CategoryChartPanel from '../../containers/accounts/CategoryChartPanel'

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
                    <CategoryChartPanel />
                </div>
                <TransactionsPanel />
            </div>
        )
    }
}

export default Accounts