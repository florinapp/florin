import React, { Component } from 'react'
import { Button, Pagination } from 'react-bootstrap'
import TransactionTable from '../../containers/accounts/TransactionTable'
import FilterPanel from '../../containers/accounts/FilterPanel'
import UploadTransactionsModal from './UploadTransactionsModal'
import './TransactionsPanel.css'

class TransactionsPanel extends Component {
    constructor(props) {
        super(props)
        this.filter = this.props.filter
        this.sort = this.props.sort
        this.pagination = this.props.pagination
        this.currentAccountId = this.props.currentAccountId
        this.fetchTransactions = this.props.fetchTransactions
    }

    componentWillReceiveProps(nextProps) {
        const hasAccountIdChanged = () => (
            this.currentAccountId !== nextProps.currentAccountId
        )

        const hasFilterChanged = () => {
            // TODO: is there a better way to test two objects are equal?
            return JSON.stringify(this.filter) !== JSON.stringify(nextProps.filter)
        }

        const hasSortChanged = () => {
            return JSON.stringify(this.sort) !== JSON.stringify(nextProps.sort)
        }

        const hasPaginationChanged = () => {
            return JSON.stringify(this.pagination) !== JSON.stringify(nextProps.pagination)
        }

        if (!hasAccountIdChanged() && !hasFilterChanged() && !hasSortChanged() && !hasPaginationChanged()) {
            return
        }

        this.currentAccountId = nextProps.currentAccountId
        this.filter = nextProps.filter
        this.sort = nextProps.sort
        this.pagination = nextProps.pagination
        this.fetchTransactions(this.currentAccountId, this.filter, this.sort, this.pagination)
    }

    componentWillMount() {
        this.setState({showModal: false})
        // Triggers the initial fetch, subsequent fetches will be initiated by componentWillReceiveProps
        this.fetchTransactions(this.currentAccountId, this.filter, this.sort, this.pagination)
    }

    render() {
        const {uploadTransactionFile, pagination, onPageClicked} = this.props
        const {showModal} = this.state
        const {currentAccountId} = this
        return (
            <div className="col-lg-9 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Transactions</h3></div>
                    <div className="panel-body transaction-panel">
                        <FilterPanel />
                        <div className="row">
                            <div className="col-md-12">
                                <div className="btn-group pull-left" role="group" style={{marginTop: "0px"}}>
                                    <Button bsStyle="primary" onClick={
                                        () => {this.setState({showModal: true})}
                                    }>Upload Transactions</Button>
                                </div>
                                <div className="text-center">
                                    <Pagination prev next first last ellipsis boundaryLinks
                                                items={pagination.totalPages} maxButtons={5}
                                                activePage={pagination.currentPage}
                                                onSelect={onPageClicked}
                                                style={{marginTop: "0px"}}
                                    />
                                </div>
                            </div>
                        </div>
                        <TransactionTable />
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
                <UploadTransactionsModal
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