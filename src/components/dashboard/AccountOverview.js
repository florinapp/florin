import React, { Component } from 'react'
import AccountsTable from '../../containers/dashboard/AccountsTable'
import './AccountOverview.css'

class AccountOverview extends Component {
    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Account Overview</span>
                </div>
                <div className="panel-body">
                    <AccountsTable />
                </div>
            </div>
        )
    }
}

export default AccountOverview