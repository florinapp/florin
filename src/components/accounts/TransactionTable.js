import React from 'react'
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import CategorySelect from '../../containers/accounts/CategorySelect'
import Spinner from '../Spinner'
import accounting from 'accounting'
import q from '../../q'
import './TransactionTable.css'

const ButtonWithTooltip = ({buttonStyle, tooltip, onClick, children}) => {
    return (
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{tooltip}</Tooltip>}>
            <Button bsStyle={buttonStyle} bsSize="xsmall" onClick={onClick}>
                {children}
            </Button>
        </OverlayTrigger>
    )
}

const TableHeader = ({currentAccountId, filterParam, sortParam, text, width, sort}) => {
    if (!sort) {
        return (
            <th width={{ width }}>
                {text}&nbsp;
            </th>
        )
    }

    const [orderBy, direction] = (sortParam.orderBy || "").split(":")
    const isActiveOrderByField = (orderBy === sort)
    return (
        <th width={{width}}>
            {text}&nbsp;
            <span>
                <NavLink to={`/accounts/${currentAccountId}?${q(filterParam, {orderBy: `${sort}:asc`})}`}
                         className={(isActiveOrderByField && direction === "asc") ? "active" : ""}>
                    <i className={(isActiveOrderByField && direction === "asc")
                                   ? "glyphicon glyphicon-chevron-up active-sort" : "glyphicon glyphicon-chevron-up inactive-sort"}
                    />
                </NavLink>
                <NavLink to={`/accounts/${currentAccountId}?${q(filterParam, {orderBy: `${sort}:desc`})}`}
                         className={(isActiveOrderByField && direction === "desc") ? "active" : ""}>
                    <i className={(isActiveOrderByField && direction === "desc")
                                   ? "glyphicon glyphicon-chevron-down active-sort" : "glyphicon glyphicon-chevron-down inactive-sort"}
                    />
                </NavLink>
            </span>
        </th>
    )
}

const TransactionTable = ({ loadingTransactions, currentAccountId, filter, sort, transactions, onDeleteClicked, onFlagAsInternalTransferClicked }) => {
    return (
        <div className="table-responsive transaction-table">
            {loadingTransactions ? <div className="text-center"><Spinner size="64px" /></div> : 
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <TableHeader currentAccountId={currentAccountId} filterParam={filter} sortParam={sort}
                                     text="Date" width="8%" sort="date" />
                        <TableHeader currentAccountId={currentAccountId} filterParam={filter} sortParam={sort}
                                     text="Payee" sort="payee" />
                        <TableHeader currentAccountId={currentAccountId} filterParam={filter} sortParam={sort}
                                     text="Info" sort="info" />
                        <TableHeader currentAccountId={currentAccountId} filterParam={filter} sortParam={sort}
                                     text="Category" width="25%" sort="category" />
                        <TableHeader currentAccountId={currentAccountId} filterParam={filter} sortParam={sort}
                                     text="Amount" sort="amount" />
                        <TableHeader currentAccountId={currentAccountId} filterParam={filter} sortParam={sort}
                                     text="" wdith="12%" />
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
                                            {accounting.formatMoney(transaction.amount)}
                                        </span>
                                    </td>
                                    <td className="transaction-table-cell transaction-table-cell-align-center">
                                        <ButtonGroup>
                                            <ButtonWithTooltip buttonStyle="primary" tooltip="Delete the transaction"
                                                               onClick={() => { onDeleteClicked(transaction.id) }}>
                                                Delete
                                            </ButtonWithTooltip>

                                            <ButtonWithTooltip buttonStyle="default" tooltip="Flag this transaction as internal transfer"
                                                               onClick={() => { onFlagAsInternalTransferClicked(transaction.id) }}>
                                                Internal
                                            </ButtonWithTooltip>

                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
            }
        </div>
    )
}

export default TransactionTable