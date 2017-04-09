import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import accounting from 'accounting'

class CategorySummaryPanel extends Component {
    componentWillMount() {
        const { fetchCategorySummary, currentAccountId, filter } = this.props
        fetchCategorySummary(currentAccountId, filter)
    }

    componentWillReceiveProps(nextProps) {
        const { fetchCategorySummary } = this.props
        const { forceRefreshCategorySummary } = nextProps

        if (forceRefreshCategorySummary) {
            fetchCategorySummary(nextProps.currentAccountId, nextProps.filter)
            return
        }

        const hasAccountIdChanged = () => (
            this.props.currentAccountId !== nextProps.currentAccountId
        )

        const hasFilterChanged = () => {
            return JSON.stringify(this.props.filter) !== JSON.stringify(nextProps.filter)
        }

        if (!hasAccountIdChanged() && !hasFilterChanged()) {
            return
        }

        fetchCategorySummary(nextProps.currentAccountId, nextProps.filter)
    }

    render() {
        const { categorySummary, fetchCategorySummary, filter } = this.props
        const { currentDateRange } = filter
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
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

export default CategorySummaryPanel