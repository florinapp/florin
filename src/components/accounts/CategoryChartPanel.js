import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

class CategoryChartPanel extends Component {
    componentWillMount() {
        const { fetchCategorySummary, currentAccountId } = this.props
        fetchCategorySummary(currentAccountId)
    }

    componentWillReceiveProps() {
        const { fetchCategorySummary, currentAccountId } = this.props
        fetchCategorySummary(currentAccountId)
    }

    render() {
        const { categorySummary } = this.props
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Category Summary</h3>
                </div>
                <div className="panel-body">
                    <div>
                        <Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th width="20%">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorySummary.map((category) => {
                                    return (
                                        <tr key={category.category_name}>
                                            <td>{category.category_name}</td>
                                            <td>{category.amount}</td>
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