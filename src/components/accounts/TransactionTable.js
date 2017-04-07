import React from 'react'
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import './TransactionTable.css'
import CategorySelect from '../../containers/accounts/CategorySelect'

const TransactionTable = ({ transactions, onDeleteClicked }) => {

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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (transactions === undefined || transactions.length === 0) ?
                            <tr><td colSpan="6">No transactions</td></tr> :
                            transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="transaction-table-cell">
                                        {transaction.date}
                                    </td>
                                    <td className="transaction-table-cell transaction-table-cell-align-left">
                                        {transaction.payee}
                                    </td>
                                    <td className="transaction-table-cell transaction-table-cell-align-left">
                                        {transaction.info}
                                    </td>
                                    <td className="transaction-table-cell transaction-table-cell-align-left">
                                        <CategorySelect transactionId={transaction.id} categoryId={transaction.category_id} />
                                    </td>
                                    <td className="transaction-table-cell transaction-table-cell-align-right">
                                        <span className={transaction.amount < 0 ? 'debit' : 'credit'}>
                                            {transaction.amount}
                                        </span>
                                    </td>
                                    <td className="transaction-table-cell">
                                        <ButtonGroup>
                                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Delete Transaction</Tooltip>}>
                                                <Button bsSize="xsmall" onClick={() => onDeleteClicked(transaction.id)}>
                                                    Delete
                                                </Button>
                                            </OverlayTrigger>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TransactionTable