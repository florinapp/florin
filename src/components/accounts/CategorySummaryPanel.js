import React, { Component } from 'react'
import { Button, Table, Nav, NavItem, Collapse } from 'react-bootstrap'
import currencyFormatter from 'currency-formatter'
import accounting from 'accounting'
import Spinner from '../Spinner'
import './CategorySummaryPanel.css'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import COLORS from '../../colors'

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
        const transformedChartData = chartData.map(data => {
            return {
                name: data.category_name,
                value: Math.abs(data.amount),
            }
        })
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
                            <PieChart height={300} width={350}>
                                <Pie isAnimationActive={true} data={transformedChartData} cx={200} cy={200} outerRadius={80} label>
                                    {transformedChartData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]}/>)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
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