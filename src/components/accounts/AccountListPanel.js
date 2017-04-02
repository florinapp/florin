import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './AccountListPanel.css'

class AccountListPanel extends Component {

    componentDidMount() {
        let { fetchAccountsData } = this.props
        fetchAccountsData.bind(this).call()
    }

    render() {
        let { accounts, match } = this.props
        return (
            <div className="col-lg-3 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Accounts</h3></div>
                    <div className="panel-body">
                        <ul className="nav nav-pills nav-stacked">
                            {accounts.map((account) => {
                                return (
                                    <li key={account.id} className={match.params.accountId === account.id ? "active" : ""}>
                                        <NavLink to={`/accounts/${account.id}`} activeClassName="active">
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