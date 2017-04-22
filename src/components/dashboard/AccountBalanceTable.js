import React from 'react'
import { Button } from 'react-bootstrap'
import currencyFormatter from 'currency-formatter'

const AccountBalanceTable = ({ accountBalances, currentAccountId }) => {
    console.log(currentAccountId)
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
            <Button bsStyle="primary" bsSize="small"><i className="fa fa-plus"></i>&nbsp;New Balance</Button>
            <div className="table-responsive">
                {currentAccountBalance ?
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date </th>
                                <th className="current-value">Balance</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAccountBalance.balances.map(balance => (
                                <tr key={balance.id}>
                                    <td>{balance.date}</td>
                                    <td className="current-value">{currencyFormatter.format(balance.balance, {code: 'CAD'})}</td>
                                    <td>
                                        <Button bsStyle="primary" bsSize="xsmall"><i className="fa fa-trash-o"></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : ""}
            </div>
        </div>
    )
}

export default AccountBalanceTable