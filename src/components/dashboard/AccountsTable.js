import React from 'react'
import currencyFormatter from 'currency-formatter'

const AccountsTable = ({accounts}) => {
    if (accounts.length === 0) {
        return <div>No Accounts</div>  // TODO: add link to add accounts
    }
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover table-condensed">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Current Value</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map(account => (
                        <tr key={account.name}>
                            <td>{account.name}</td>
                            <td>{account.type}</td>
                            <td className="current-value">{currencyFormatter.format(account.currentValue, {code: 'CAD'})}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AccountsTable