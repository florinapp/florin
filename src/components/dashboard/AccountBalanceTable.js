import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import currencyFormatter from 'currency-formatter'
import NewAccountBalanceModal from './NewAccountBalanceModal'

class AccountBalanceTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showNewAccountBalanceModal: false
        }
    }

    render() {
        const {
            accountBalances,
            currentAccountId,
            createAccountBalance,
            fetchAccountBalancesData,
            deleteAccountBalance
        } = this.props
        if (!currentAccountId) {
            return <div />
        }

        let currentAccountBalance = null
        accountBalances.forEach((accountBalance) => {
            if (accountBalance.id === currentAccountId) {
                currentAccountBalance = accountBalance
            }
        })

        return (
            <div>
                <hr />
                <Button bsStyle="primary" bsSize="small" onClick={() => this.setState({showNewAccountBalanceModal: true})}>
                    <i className="fa fa-plus"></i>
                    &nbsp;New Balance</Button>
                <div className="table-responsive">
                    {currentAccountBalance ?
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th className="current-value">Balance</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAccountBalance.balances.map(balance => {
                                    console.log(balance)
                                    return (
                                    <tr key={balance.id}>
                                        <td>{balance.date}</td>
                                        <td className="current-value">{currencyFormatter.format(balance.balance, { code: 'CAD' })}</td>
                                        <td>
                                            <Button bsStyle="primary" bsSize="xsmall" onClick={
                                                () => {
                                                    deleteAccountBalance(balance.account_id, balance.id)
                                                    fetchAccountBalancesData()
                                                }
                                            }>
                                                <i className="fa fa-trash-o"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        : ""}
                </div>
                <NewAccountBalanceModal
                    show={this.state.showNewAccountBalanceModal}
                    createAccountBalance={(date, balance) => createAccountBalance(currentAccountId, date, balance)}
                    onClose={() => {
                        this.setState({showNewAccountBalanceModal: false})
                        fetchAccountBalancesData()
                    }} />
            </div>
        )
    }
}

export default AccountBalanceTable