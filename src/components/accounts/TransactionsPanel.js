import React, { Component } from 'react'

const TransactionTable = ({transactions}) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Transaction Date</th>
                        <th>Payee </th>
                        <th>Description </th>
                        <th>Category </th>
                        <th>Amount </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (transactions === undefined || transactions.length === 0) ?
                            <tr><td colSpan="5">No transactions</td></tr> :
                            transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.payee}</td>
                                    <td>{transaction.description}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.amount}</td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>
    )
}

class TransactionsPanel extends Component {
    componentDidMount() {
        let currentAccountId = this.props.match.params.accountId
        let { fetchTransactions } = this.props
        if (currentAccountId !== undefined) {
            fetchTransactions(currentAccountId)
        }
    }

    render() {
        console.log(this.props)
        let { accounts } = this.props
        let transactions = accounts.transactions
        return (
            <div className="col-lg-9 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Transactions</h3></div>
                    <div className="panel-body">
                        <TransactionTable transactions={transactions} />
                    </div >
                    <div className="panel-footer">
                        <div className="row">
                            <div className="col-md-12">
                                <button className="btn btn-primary" type="button">New Snapshot</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TransactionsPanel