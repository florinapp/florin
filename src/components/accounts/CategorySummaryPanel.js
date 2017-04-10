import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Doughnut } from 'react-chartjs'
import accounting from 'accounting'

class CategorySummaryPanel extends Component {
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
        const { categorySummary, fetchCategorySummary, filter } = this.props
        const { currentDateRange } = filter
        const chartData = categorySummary.map((item) => {
            return {
                value: Math.abs(item.amount),
                label: item.category_name
            }
        })
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Category Summary ({currentDateRange})</span>
                    <div className="pull-right">
                        <button type="button" className="btn btn-primary btn-xs"
                                onClick={()=>fetchCategorySummary("_all", filter)}>
                            <span className="glyphicon glyphicon-refresh"></span>
                        </button>
                    </div>
                </div>
                <div className="panel-body">
                    <h3>Expense</h3>
                    <div className="text-center">
                        <Doughnut data={chartData} />
                    </div>
                    <div>
                        <Table condensed hover>
                            <tbody>
                                {categorySummary.map((category) => {
                                    return (
                                        <tr key={category.category_name}>
                                            <td>{category.category_name}</td>
                                            <td width="20%" style={{textAlign: "right"}}>
                                                {accounting.formatMoney(category.amount)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><strong>Total:</strong></td>
                                    <td width="20%" style={{textAlign: "right"}}>
                                        <strong>
                                        {accounting.formatMoney(categorySummary.reduce((aggregate, category) => {
                                            return aggregate + Number.parseFloat(category.amount)
                                        }, 0))
                                        }
                                        </strong>
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                    <hr />
                    <h3>Income</h3>
                </div>
            </div>
        )
    }
}

export default CategorySummaryPanel