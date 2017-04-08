import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import moment from 'moment'
import TransactionTable from '../../containers/accounts/TransactionTable'
import FilterPanel from '../../containers/accounts/FilterPanel'
import UploadTransactionsModal from './UploadTransactionsModal'
import './TransactionsPanel.css'

const buildDateRangeRequestParams = (filter) => {
    let { currentDateRange } = filter
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

const buildRequestParams = (filter) => {
    const builders = [
        buildDateRangeRequestParams,
        ({ includeUncategorized }) => ({ includeUncategorized }),
        ({ includeExcluded }) => ({ includeExcluded })
    ]
    let params = builders.reduce((params, fn) => (
        {
            ...params,
            ...fn(params)
        }
    ), filter)
    console.log(params)
    return params
}

class TransactionsPanel extends Component {
    constructor(props) {
        super(props)
        this.filter = this.props.filter
        this.currentAccountId = this.props.currentAccountId
        this.fetchTransactions = this.props.fetchTransactions
    }

    componentWillReceiveProps(nextProps) {
        if (this.currentAccountId === nextProps.currentAccountId && this.filter.currentDateRange === nextProps.filter.currentDateRange) {
            return
        }

        this.currentAccountId = nextProps.currentAccountId
        // this.filter.currentDateRange = nextProps.filter.currentDateRange
        this.filter = nextProps.filter
        this.fetchTransactions(this.currentAccountId, buildRequestParams(this.filter))
    }

    componentDidMount() {  // Triggers the initial fetch, subsequent fetches will be initiated by componentWillReceiveProps
        this.fetchTransactions(this.currentAccountId, buildRequestParams(this.filter))
    }

    componentWillMount() {
        this.setState({showModal: false})
    }

    render() {
        const {uploadTransactionFile} = this.props
        const {showModal} = this.state
        const {currentAccountId} = this
        return (
            <div className="col-lg-9 col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Transactions</h3></div>
                    <div className="panel-body">
                        <FilterPanel {...this} />
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