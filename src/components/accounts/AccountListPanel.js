import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import NewAccountModal from '../../containers/accounts/NewAccountModal'
import './AccountListPanel.css'
import Spinner from '../Spinner'

class AccountListPanel extends Component {

    componentDidMount() {
        let { fetchAccountsData } = this.props
        fetchAccountsData.bind(this).call()
    }

    render() {
        let { loadingAccountsData, accounts, match, location, currentAccountId, showNewAccountModal } = this.props
        currentAccountId = currentAccountId || match.params.accountId
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Accounts
                    {loadingAccountsData ? <Spinner size="16px" /> : ""}
                    </span>
                    <div className="pull-right">
                        <button type="button" className="btn btn-primary btn-xs" onClick={() => showNewAccountModal()}>
                            <span className="fa fa-plus-circle"></span>
                            &nbsp;New
                        </button>
                    </div>
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
                <NewAccountModal />
            </div>
        )
    }
}

export default AccountListPanel