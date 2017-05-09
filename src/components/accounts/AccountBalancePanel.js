import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import currencyFormatter from 'currency-formatter'

class AccountBalancePanel extends Component {
    componentWillMount() {
        const { fetchAccountBalancesData } = this.props
        fetchAccountBalancesData()
    }
    render() {
        const {
            accountBalances,
            currentAccountId,
            createAccountBalance,
            fetchAccountBalancesData,
            deleteAccountBalance
        } = this.props

        if (!currentAccountId || currentAccountId === '_all') {
            return <div />
        }

        let currentAccountBalance = null
        accountBalances.forEach((accountBalance) => {
            if (accountBalance.id.toString() === currentAccountId.toString()) {
                currentAccountBalance = accountBalance
            }
        })

        return (
            <div>
                <Panel header={<h3>Account Balances</h3>}>
                    <Button bsStyle="primary" bsSize="small" onClick={() => this.setState({showNewAccountBalanceModal: true})}>
                        <i className="fa fa-plus"></i>
                        &nbsp;New Balance</Button>
                    <div className="table-responsive">
                    </div>
                    {!currentAccountBalance ? "" :
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
                    }
                </Panel>
            </div>
        )
    }
}

export default AccountBalancePanel
