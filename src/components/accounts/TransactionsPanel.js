import React, { Component } from 'react'
import { Button, Pagination } from 'react-bootstrap'
import moment from 'moment'
import TransactionTable from '../../containers/accounts/TransactionTable'
import FilterPanel from '../../containers/accounts/FilterPanel'
import UploadTransactionsModal from './UploadTransactionsModal'
import './TransactionsPanel.css'

const buildDateRangeRequestParams = ({ currentDateRange }) => {
    const FORMAT = 'YYYY-MM-DD'
    if (currentDateRange === undefined) {
        return {}
    }

    const now = moment(moment.now())
    switch (currentDateRange) {
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

const buildPaginationRequestParams = ({ currentPage }) => {
    return {
        page: currentPage
    }
}

const buildRequestParams = (filter, pagination) => {
    const builders = [
        buildDateRangeRequestParams,
        ({ onlyUncategorized }) => ({ onlyUncategorized }),
        ({ includeExcluded }) => ({ includeExcluded }),
        buildPaginationRequestParams,
    ]
    let params = builders.reduce((params, fn) => (
        {
            ...params,
            ...fn(params)
        }
    ), {...filter, ...pagination})
    console.log(params)
    return params
}

class TransactionsPanel extends Component {
    constructor(props) {
        super(props)
        this.filter = this.props.filter
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

        const hasPaginationChanged = () => {
            return JSON.stringify(this.pagination) !== JSON.stringify(nextProps.pagination)
        }

        if (!hasAccountIdChanged() && !hasFilterChanged() && !hasPaginationChanged()) {
            return
        }

        this.currentAccountId = nextProps.currentAccountId
        this.filter = nextProps.filter
        this.pagination = nextProps.pagination
        this.fetchTransactions(this.currentAccountId, buildRequestParams(this.filter, this.pagination))
    }

    componentDidMount() {  // Triggers the initial fetch, subsequent fetches will be initiated by componentWillReceiveProps
        this.fetchTransactions(this.currentAccountId, buildRequestParams(this.filter, this.pagination))
    }

    componentWillMount() {
        this.setState({showModal: false})
    }

    render() {
        const {uploadTransactionFile, pagination, onPageClicked} = this.props
        const {showModal} = this.state
        const {currentAccountId} = this
        console.log(pagination)
        return (
            <div className="col-lg-9 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Transactions</h3></div>
                    <div className="panel-body transaction-panel">
                        <FilterPanel />
                        <TransactionTable />
                        <Pagination prev next first last ellipsis boundaryLinks
                                    items={pagination.totalPages} maxButtons={5}
                                    activePage={pagination.currentPage}
                                    onSelect={onPageClicked}
                        />
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