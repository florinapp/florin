import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import AccountEditModal from '../../containers/accounts/AccountEditModal'
import './AccountListPanel.css'
import Spinner from '../Spinner'
import Dialog from 'react-bootstrap-dialog'

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
            saveNewAccount,
            updateAccount,
            deleteAccount,
        } = this.props
        const { showNewAccountModal, showEditAccountModal } = this.state
        currentAccountId = currentAccountId || match.params.accountId
        const currentAccount = currentAccountId ? accounts.filter((account) => {
            return account.id.toString() === currentAccountId.toString()
        })[0] : null
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
                            this.setState({
                                ...this.state,
                                showNewAccountModal: true
                            })
                        }}>
                            <span className="fa fa-plus-circle"></span>
                            &nbsp;New
                        </button>
                        <Separator />
                        {currentAccountId && currentAccountId !== "_all" ?
                         <button type="button" className="btn btn-primary btn-xs" onClick={() => {
                             this.setState({
                                 ...this.state,
                                 showEditAccountModal: true
                             })
                         }}>
                             <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                             &nbsp;Edit
                         </button>
                         : ""}
                        <Separator />
                        {currentAccountId && currentAccountId !== "_all" ?
                         <button type="button" className="btn btn-danger btn-xs" onClick={() => {
                                this.refs.dialog.show({
                                    title: 'Are you sure?',
                                    body: 'Do you want to delete this account?',
                                    actions: [
                                        Dialog.CancelAction(),
                                        Dialog.OKAction(() => {
                                            deleteAccount(currentAccountId)
                                        })
                                    ],
                                })
                            }}>
                             <i className="fa fa-trash-o" aria-hidden="true"></i>
                             &nbsp;Delete
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
                                            {account.uncategorized_transaction_count == 0 ? "" :
                                                <OverlayTrigger placement="top" overlay={
                                                    <Tooltip key={account.id}>Number of total uncategorized transactions</Tooltip>
                                                }>
                                                        <Badge pullRight>{account.uncategorized_transaction_count}</Badge>
                                                </OverlayTrigger>
                                            }
                                        </NavLink>
                                    </li>
                                )
                            })}
                        </ul>
                    }
                </div>
                <AccountEditModal
                    mode="create"
                    show={showNewAccountModal}
                    onSaveClicked={saveNewAccount}
                    closeDialog={() => {
                        this.setState({
                            ...this.state,
                            showNewAccountModal: false
                        })
                    }}
                />
                <AccountEditModal
                    mode="update"
                    show={showEditAccountModal}
                    currentAccount={currentAccount}
                    onSaveClicked={(account) => updateAccount(currentAccountId, account)}
                    closeDialog={() => {
                        this.setState({
                            ...this.state,
                            showEditAccountModal: false
                        })
                    }}
                />
                <Dialog ref="dialog" />
            </div>
        )
    }
}

export default AccountListPanel