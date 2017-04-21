import React from 'react'
import { Table, Button } from 'react-bootstrap'

const AccountBalanceTable = () => {
    return (
        <div>
            <hr />
            <Button bsStyle="primary" bsSize="small"><i className="fa fa-plus"></i>&nbsp;New Balance</Button>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date </th>
                            <th>Balance</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2017-01-01 </td>
                            <td>$400.00 </td>
                            <td>
                                <Button bsStyle="primary" bsSize="xsmall"><i className="fa fa-trash-o"></i></Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Cell 3</td>
                            <td>Cell 4</td>
                            <td>
                                <Button bsStyle="primary" bsSize="xsmall"><i className="fa fa-trash-o"></i></Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AccountBalanceTable