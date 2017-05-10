import React, { Component } from 'react'
import { Button, Table, Nav, NavItem, Collapse } from 'react-bootstrap'
import currencyFormatter from 'currency-formatter'
import accounting from 'accounting'
import Spinner from '../Spinner'
import NVD3Chart from 'react-nvd3'
import 'nvd3/build/nv.d3.css'
import './CategorySummaryPanel.css'

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
            selectedTab: 'expense',
            collapsed: false,
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
                    <i className={"collapse-trigger fa fa-chevron-" + (this.state.collapsed ? "down" : "up")}
                        aria-hidden="true" onClick={() => {
                        this.setState({collapsed: !this.state.collapsed})
                    }}></i>
                    <span className="panel-title">Category Summary ({currentDateRange})</span>
                    {loadingCategorySummary ? <Spinner size="16px" /> : ""}
                    <div className="pull-right">
                        <Button bsStyle="primary" bsSize="xsmall"
                                onClick={()=>fetchCategorySummary("_all", filter)}>
                            <i className="fa fa-refresh"></i>&nbsp;Refresh
                        </Button>
                    </div>
                </div>

                <Collapse in={this.state.collapsed}>
                    <div className="panel-body">
                        <Nav bsStyle="tabs" justified activeKey={this.state.selectedTab} onSelect={(key) => this.setState({selectedTab: key})}>
                            <NavItem eventKey="expense">Expense</NavItem>
                            <NavItem eventKey="income">Income</NavItem>
                        </Nav>
                        <div className="col-lg-6">
                            <NVD3Chart type="pieChart" datum={getChartData(chartData)} x="categoryName" y="amount"
                                    showLabels={false} showLegend={false} valueFormat={(v) => currencyFormatter.format(v, {code: 'CAD'})}/>
                        </div>
                        <div className="col-lg-6">
                            <SummaryTable data={chartData} />
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}

export default CategorySummaryPanel