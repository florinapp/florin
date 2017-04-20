import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import NewAccountModal from '../../containers/accounts/NewAccountModal'
import './AccountListPanel.css'
import Spinner from '../Spinner'

const Separator = () => <span style={{paddingRight: "2px"}}></span>

class AccountListPanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showNewAccountModal: false,
            showEditAccountModal: false
        }
    }

    componentDidMount() {
        let { fetchAccountsData } = this.props
        fetchAccountsData.bind(this).call()
    }

    render() {
        let {
            loadingAccountsData,
            accounts,
            match,
            location,
            currentAccountId,
            fetchAccountsData,
        } = this.props
        const { showNewAccountModal, showEditAccountModal } = this.state
        currentAccountId = currentAccountId || match.params.accountId
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Accounts
                    {loadingAccountsData ? <Spinner size="16px" /> : ""}
                    </span>
                    <div className="pull-right">
                        <button type="button" className="btn btn-primary btn-xs" onClick={() => fetchAccountsData()}>
                            <span className="fa fa-refresh"></span>
                            &nbsp;Refresh
                        </button>
                        <Separator />
                        <button type="button" className="btn btn-primary btn-xs" onClick={() => {
                            console.log(this)
                            this.setState({
                                ...this.state,
                                showNewAccountModal: true
                            })
                        }}>
                            <span className="fa fa-plus-circle"></span>
                            &nbsp;New
                        </button>
                        <Separator />
                        {currentAccountId !== "_all" ?
                         <button type="button" className="btn btn-primary btn-xs" onClick={() => showEditAccountModal()}>
                             <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                             &nbsp;Edit
                         </button>
                         : ""}
                    </div>
                </div>
                <div className="panel-body">
                    {loadingAccountsData ? "" :
                        <ul className="nav nav-pills nav-stacked">
                            <li className={currentAccountId === undefined || currentAccountId === "_all" ? "active" : ""}>
                                <NavLink to={`/accounts/_all${location.search}`} activeClassName="active">All</NavLink>
                            </li>
                            {accounts.map((account) => {
                                const isActive = currentAccountId === account.id.toString()
                                return (
                                    <li key={account.id} className={isActive ? "active" : ""}>
                                        <NavLink to={`/accounts/${account.id}${location.search}`} activeClassName="active">
                                        {account.institution}&nbsp;{account.name}
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                    }
                </div>
                <NewAccountModal show={showNewAccountModal} closeDialog={() => {
                    this.setState({
                        ...this.state,
                        showNewAccountModal: false
                    })
                    // TODO: Dispatch fetchAccountData
                }}/>
            </div>
        )
    }
}

export default AccountListPanel