import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './AccountListPanel.css'

class AccountListPanel extends Component {

    constructor(props) {
        super(props)
        this.fetchAccountsData = props.fetchAccountsData.bind(this)
    }

    componentDidMount() {
        this.fetchAccountsData()
    }

    // TODO: get the currentAccount from the router accountId param
    render() {
        let { accounts } = this.props
        return (
            <div className="col-lg-3 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Accounts</h3></div>
                    <div className="panel-body">
                        <ul className="nav nav-pills nav-stacked">
                            {accounts.map((account) => {
                                return (
                                    <li key={account.id}>
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