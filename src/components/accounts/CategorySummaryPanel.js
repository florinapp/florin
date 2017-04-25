import React, { Component } from 'react'
import { Table, Nav, NavItem } from 'react-bootstrap'
import currencyFormatter from 'currency-formatter'
import accounting from 'accounting'
import Spinner from '../Spinner'
import NVD3Chart from 'react-nvd3'
import 'nvd3/build/nv.d3.css'

const getChartData = (data) => {
    return data.map(item => {
        return {
            categoryName: item.category_name,
            amount: Math.abs(item.amount)
        }
    })
}

const SummaryTable = ({data}) => {
    return (
        <div>
            <Table condensed hover>
                <tbody>
                    {data.map((category) => {
                        return (
                            <tr key={category.category_name}>
                                <td>{category.category_name}</td>
                                <td width="20%" style={{ textAlign: "right" }}>
                                    {accounting.formatMoney(category.amount)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Total:</strong></td>
                        <td width="20%" style={{ textAlign: "right" }}>
                            <strong>
                                {accounting.formatMoney(data.reduce((aggregate, category) => {
                                    return aggregate + Number.parseFloat(category.amount)
                                }, 0))
                                }
                            </strong>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}

class CategorySummaryPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'expense'
        }
    }

    componentWillMount() {
        const { fetchCategorySummary, currentAccountId, filter } = this.props
        fetchCategorySummary(currentAccountId, filter)
    }

    componentWillReceiveProps(nextProps) {
        const { fetchCategorySummary } = this.props
        const hasAccountIdChanged = () => (
            this.props.currentAccountId !== nextProps.currentAccountId
        )

        const hasFilterChanged = () => {
            return JSON.stringify(this.props.filter) !== JSON.stringify(nextProps.filter)
        }

        const hasTransactionsChanged = () => {
            return JSON.stringify(this.props.transactions) !== JSON.stringify(nextProps.transactions)
        }

        if (!hasAccountIdChanged() && !hasFilterChanged()  && !hasTransactionsChanged()) {
            return
        }

        fetchCategorySummary(nextProps.currentAccountId, nextProps.filter)
    }


    render() {
        const { loadingCategorySummary, categorySummary, fetchCategorySummary, filter } = this.props
        const { income, expense } = categorySummary
        const { currentDateRange } = filter
        const chartData = this.state.selectedTab === 'expense' ? expense : income
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Category Summary ({currentDateRange})</span>
                    {loadingCategorySummary ? <Spinner size="16px" /> : ""}
                    <div className="pull-right">
                        <button type="button" className="btn btn-primary btn-xs"
                                onClick={()=>fetchCategorySummary("_all", filter)}>
                            <i className="fa fa-refresh"></i>&nbsp;Refresh
                        </button>
                    </div>
                </div>

                <div className="panel-body">
                    <Nav bsStyle="tabs" justified activeKey={this.state.selectedTab} onSelect={(key) => this.setState({selectedTab: key})}>
                        <NavItem eventKey="expense">Expense</NavItem>
                        <NavItem eventKey="income">Income</NavItem>
                    </Nav>
                    <NVD3Chart type="pieChart" datum={getChartData(chartData)} x="categoryName" y="amount"
                               showLabels={false} showLegend={false} valueFormat={(v) => currencyFormatter.format(v, {code: 'CAD'})}/>
                    <SummaryTable data={chartData} />
                </div>
            </div>
        )
    }
}

export default CategorySummaryPanel