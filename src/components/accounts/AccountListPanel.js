import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './AccountListPanel.css'
import Spinner from '../Spinner'

class AccountListPanel extends Component {

    componentDidMount() {
        let { fetchAccountsData } = this.props
        fetchAccountsData.bind(this).call()
    }

    render() {
        let { loadingAccountsData, accounts, match, location, currentAccountId } = this.props
        currentAccountId = currentAccountId || match.params.accountId
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Accounts
                    {loadingAccountsData ? <Spinner size="16px" /> : ""}
                    </h3>
                </div>
                <div className="panel-body">
                    {loadingAccountsData ? "" :
                        <ul className="nav nav-pills nav-stacked">
                            <li className={currentAccountId === undefined || currentAccountId === "_all" ? "active" : ""}>
                                <NavLink to={`/accounts/_all${location.search}`} activeClassName="active">All</NavLink>
                            </li>
                            {accounts.map((account) => {
                                const isActive = currentAccountId === account.id
                                return (
                                    <li key={account.id} className={isActive ? "active" : ""}>
                                        <NavLink to={`/accounts/${account.id}${location.search}`} activeClassName="active">
                                        {account.name}
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                    }
                </div>
            </div>
        )
    }
}

export default AccountListPanel