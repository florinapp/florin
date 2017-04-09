import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

class CategoryChartPanel extends Component {
    componentWillMount() {
        const { fetchCategorySummary, currentAccountId } = this.props
        fetchCategorySummary(currentAccountId)
    }

    render() {
        const { categorySummary, fetchCategorySummary } = this.props
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <span className="panel-title">Category Summary</span>
                    <div className="pull-right">
                        <button type="button" className="btn btn-primary btn-xs"
                                onClick={()=>fetchCategorySummary("_all")}>
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
                                                {category.amount}
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

export default CategoryChartPanel