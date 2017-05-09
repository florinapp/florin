import React, { Component } from 'react'
import { Checkbox } from 'react-bootstrap'
import currencyFormatter from 'currency-formatter'

class AccountsTable extends Component {
    componentDidMount() {
        const { onRefresh } = this.props
        onRefresh()
    }

    render() {
        const { accountBalances, currentAccountId } = this.props
        if (accountBalances.length === 0) {
            return <div>No Accounts</div>  // TODO: add link to add accounts
        }
        return (
            <div className="table-responsive">
                <table className="table table-striped table-hover table-condensed">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th className="current-value" width="20%">Latest Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountBalances.map(account => {
                            const latestBalance = account.balances[account.balances.length - 1]
                            return <tr key={account.id}>
                                <td style={{verticalAlign: "middle"}}>{account.institution} - {account.name}</td>
                                <td style={{verticalAlign: "middle"}}>{account.type}</td>
                                <td style={{verticalAlign: "middle"}} className="current-value">{
                                    latestBalance ? currencyFormatter.format(latestBalance.balance, { code: 'CAD' }) : "N/A"
                                }</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default AccountsTable