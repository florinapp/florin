import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import TransactionTable from '../../containers/accounts/TransactionTable'
import UploadTransactionsModal from './UploadTransactionsModal'
import './TransactionsPanel.css'

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
                        <li key={filter.name} role="presentation"
                            className={currentDateRange === filter.name ? "active" : ""}>
                            <NavLink to={`/accounts/${currentAccountId}?dateRange=${filter.name}`}>
                                {filter.caption}
                            </NavLink>
                        </li>
                ))}
                <li>
                    <hr />
                </li>
                <li>
                    <NavLink to="#">Uncategorized</NavLink>
                </li>
                <li>
                    <NavLink to="#">Excluded</NavLink>
                </li>
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