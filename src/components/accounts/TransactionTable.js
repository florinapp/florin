import React from 'react'
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import './TransactionTable.css'
import CategorySelect from '../../containers/accounts/CategorySelect'

const ButtonWithTooltip = ({buttonStyle, tooltip, onClick, children}) => {
    return (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{tooltip}</Tooltip>}>
            <Button bsStyle={buttonStyle} bsSize="xsmall" onClick={onClick}>
                {children}
            </Button>
        </OverlayTrigger>
    )
}

const TransactionTable = ({ transactions, onDeleteClicked, onExcludeClicked }) => {

    return (
        <div className="table-responsive transaction-table">
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="5%">Date</th>
                        <th>Payee</th>
                        <th>Info</th>
                        <th width="25%">Category</th>
                        <th>Amount</th>
                        <th width="12%"></th>
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
                                    <td className="transaction-table-cell transaction-table-cell-align-left">
                                        <ButtonGroup>
                                            <ButtonWithTooltip buttonStyle="primary" tooltip="Delete the transaction"
                                                               onClick={() => { onDeleteClicked(transaction.id) }}>
                                                Delete
                                            </ButtonWithTooltip>

                                            <ButtonWithTooltip buttonStyle="default" tooltip="Exclude the transaction"
                                                               onClick={() => { onExcludeClicked(transaction.id) }}>
                                                Exclude
                                            </ButtonWithTooltip>

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