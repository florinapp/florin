import React, { Component } from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import moment from 'moment'
import './TransactionsPanel.css'

// TODO: This component is managing too much state
// Consider migrate it to a container
class UploadTransactionsModalDialog extends Component {
    componentWillMount() {
        this.setState({
            uploadComplete: false,
            totalImported: 0,
            totalSkipped: 0
        })
    }

    render() {
        const { accountId, show, onClose, onUpload} = this.props
        const { uploadComplete, totalImported, totalSkipped } = this.state
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Upload Transactions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert bsStyle="info">
                        <span>
                            Total Transaction Imported: {totalImported}
                        </span>
                            <br/>
                        <span>
                            Total Transaction Skipped: {totalSkipped}
                        </span>
                    </Alert>
                    <Dropzone onDrop={(files) => {
                        onUpload(files, (err, res) => {
                            const { totalImported, totalSkipped } = res.body
                            this.setState({
                                uploadComplete: true,
                                totalImported,
                                totalSkipped
                            })
                        })
                    }}>
                        <div>Drag and Drop your transaction file here</div>
                    </Dropzone>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

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
                                    <td className="center">{transaction.date}</td>
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

const FilterPanel = ({currentAccountId, currentDateRange}) => {
    const presetFilters = [
        {name: 'thisMonth', caption: 'This Month'},
        {name: 'lastMonth', caption: 'Last Month'},
        {name: 'thisYear', caption: 'This Year'}
    ]

    return (
        <div className="filter-panel">
            <ul className="nav nav-pills">
                {presetFilters.map((filter) => (
                        <li key={filter.name} role="presentation" className={currentDateRange === filter.name ? "active" : ""}>
                            <NavLink to={`/accounts/${currentAccountId}?dateRange=${filter.name}`}>
                                {filter.caption}
                            </NavLink>
                        </li>
                ))}
            </ul>
        </div>
    )
}

class TransactionsPanel extends Component {
    constructor(props) {
        super(props)
        this.currentAccountId = this.props.currentAccountId
        this.currentDateRange = this.props.currentDateRange
        this.fetchTransactions = this.props.fetchTransactions
    }

    buildRequestParams() {
        const FORMAT = 'YYYY-MM-DD'
        if (this.currentDateRange === undefined) {
            return {}
        }

        const now = moment(moment.now())
        switch (this.currentDateRange) {
            case 'thisMonth':
                return {
                    startDate: now.startOf('month').format(FORMAT),
                    endDate: now.endOf('month').format(FORMAT)
                }
            case 'lastMonth':
                const lastMonth = moment(now - moment.duration(32, 'd'))
                return {
                    startDate: lastMonth.startOf('month').format(FORMAT),
                    endDate: lastMonth.endOf('month').format(FORMAT)
                }
            case 'thisYear':
                return {
                    startDate: now.startOf('year').format(FORMAT),
                    endDate: now.endOf('year').format(FORMAT)
                }
            default:
                return {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.currentAccountId === nextProps.currentAccountId && this.currentDateRange === nextProps.currentDateRange) {
            return
        }

        this.currentAccountId = nextProps.currentAccountId
        this.currentDateRange = nextProps.currentDateRange
        this.fetchTransactions(this.currentAccountId, this.buildRequestParams())
    }

    componentDidMount() {  // Triggers the initial fetch, subsequent fetches will be initiated by componentWillReceiveProps
        this.fetchTransactions(this.currentAccountId, this.buildRequestParams())
    }

    componentWillMount() {
        this.setState({showModal: false})
    }

    render() {
        const {transactions, uploadTransactionFile} = this.props
        const {showModal} = this.state
        const {currentAccountId} = this
        return (
            <div className="col-lg-9 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Transactions</h3></div>
                    <div className="panel-body">
                        <FilterPanel {...this} />
                        <TransactionTable transactions={transactions} />
                    </div >
                    <div className="panel-footer">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="btn-group" role="group">
                                    <Button bsStyle="primary" onClick={
                                        () => {this.setState({showModal: true})}
                                    }>Upload Transactions</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <UploadTransactionsModalDialog
                    accountId={this.currentAccountId}
                    show={showModal}
                    onClose={() => this.setState({ showModal: false })}
                    onUpload={(files, callback) => uploadTransactionFile(currentAccountId, files, callback)}
                />
            </div>
        )
    }
}

export default TransactionsPanel