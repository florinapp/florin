import React, { Component } from 'react'
import AccountsTable from '../../containers/dashboard/AccountsTable'
import AccountBalanceTable from './AccountBalanceTable'
import './AccountOverview.css'

class AccountOverview extends Component {

    componentDidMount() {
        this.props.onComponentMount.call(this)
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Account Overview</span>
                </div>
                <div className="panel-body">
                    <AccountsTable />
                    <AccountBalanceTable />
                </div>
            </div>
        )
    }
}

export default AccountOverview