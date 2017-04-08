import React, { Component } from 'react'
import AccountListPanel from '../../containers/accounts/AccountListPanel'
import TransactionsPanel from '../../containers/accounts/TransactionsPanel'

class Accounts extends Component {

    componentDidMount() {
        const {onLoad} = this.props
        onLoad.bind(this).call()
    }

    render() {
        return (
            <div>
                <div className="col-lg-3 col-md-6">
                    <AccountListPanel />
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Category Stats</h3>
                        </div>
                        <div className="panel-body">
                        </div>
                    </div>
                </div>
                <TransactionsPanel />
            </div>
        )
    }
}

export default Accounts