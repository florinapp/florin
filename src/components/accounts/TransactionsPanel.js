import React from 'react'

const TransactionsPanel = () => {
    return (
        <div className="col-lg-9 col-md-6">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Transactions</h3></div>
                <div className="panel-body">
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
                                <tr>
                                    <td>2017-03-01 </td>
                                    <td>Wal-mart CA</td>
                                    <td>Vaughan ON CAN</td>
                                    <td>Shopping::Other </td>
                                    <td>$60.84 </td>
                                </tr>
                                <tr>
                                    <td>2017-03-15 </td>
                                    <td>Eft Tr</td>
                                    <td>Online Payment</td>
                                    <td>Income::Salary </td>
                                    <td>$2957.09 </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
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

export default TransactionsPanel