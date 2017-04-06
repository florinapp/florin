import React from 'react'
import './TransactionTable.css'
import CategorySelect from '../../containers/accounts/CategorySelect'

const TransactionTable = ({ transactions }) => {
    return (
        <div className="table-responsive transaction-table">
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="10%">Transaction Date</th>
                        <th>Payee</th>
                        <th>Info</th>
                        <th width="25%">Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (transactions === undefined || transactions.length === 0) ?
                            <tr><td colSpan="5">No transactions</td></tr> :
                            transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="transaction-table-cell">{transaction.date}</td>
                                    <td className="transaction-table-cell transaction-table-cell-align-left">{transaction.payee}</td>
                                    <td className="transaction-table-cell transaction-table-cell-align-left">{transaction.info}</td>
                                    <td className="transaction-table-cell transaction-table-cell-align-left">
                                        <CategorySelect transactionId={transaction.id} categoryId={transaction.category_id} />
                                    </td>
                                    <td className="transaction-table-cell transaction-table-cell-align-right">{transaction.amount}</td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TransactionTable