import React, { Component } from 'react'
import './AccountListPanel.css'

class AccountListPanel extends Component {

    constructor(props) {
        super(props)
        this.fetchAccountsData = props.fetchAccountsData.bind(this)
    }

    componentDidMount() {
        this.fetchAccountsData()
    }

    // TODO: define a route for /accounts/ACCOUNT_ID
    render() {
        let { accounts, currentAccount, onAccountSelected } = this.props
        return (
            <div className="col-lg-3 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Accounts</h3></div>
                    <div className="panel-body">
                        <ul className="nav nav-pills nav-stacked">
                            {accounts.map((account) => {
                                return (
                                    <li key={account.id} className={currentAccount === account.id ? "active" :""}>
                                        <a onClick={()=>{onAccountSelected(account.id)}}>{account.name}</a>
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