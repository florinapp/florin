import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './AccountListPanel.css'

class AccountListPanel extends Component {

    componentDidMount() {
        let { fetchAccountsData } = this.props
        fetchAccountsData.bind(this).call()
    }

    render() {
        let { accounts, match, location, currentAccountId } = this.props
        return (
            <div className="col-lg-3 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Accounts</h3></div>
                    <div className="panel-body">
                        <ul className="nav nav-pills nav-stacked">
                            {accounts.map((account) => {
                                const isActive = currentAccountId === account.id || match.params.accountId === account.id
                                return (
                                    <li key={account.id} className={isActive ? "active" : ""}>
                                        <NavLink to={`/accounts/${account.id}${location.search}`} activeClassName="active">
                                        {account.name}
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default AccountListPanel