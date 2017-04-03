import React, { Component } from 'react'

const TransactionTable = ({transactions}) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="10%">Transaction Date</th>
                        <th>Payee</th>
                        <th>Info</th>
                        <th>Category</th>
                        <th>Amount</th>
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
                                    <td>{transaction.info}</td>
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
    constructor(props) {
        super(props)
        this.currentAccountId = this.props.currentAccountId
        this.fetchTransactions = this.props.fetchTransactions
    }

    componentWillReceiveProps(nextProps) {
        if (this.currentAccountId === nextProps.currentAccountId) {
            return
        }

        this.currentAccountId = nextProps.currentAccountId
        this.fetchTransactions(this.currentAccountId)
    }

    componentDidMount() {  // Triggers the initial fetch, subsequent fetches will be initiated by componentWillReceiveProps
        this.fetchTransactions(this.currentAccountId)
    }

    render() {
        const {transactions} = this.props
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
                                <button className="btn btn-primary" type="button">New Transaction</button>
                                <button className="btn btn-default" type="button">Upload Transactions</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TransactionsPanel