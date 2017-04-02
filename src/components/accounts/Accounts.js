import React from 'react'
import AccountListPanel from '../../containers/accounts/AccountListPanel'
import TransactionsPanel from './TransactionsPanel'

const Accounts = () => {
    return (
        <div>
            <AccountListPanel />
            <TransactionsPanel />
        </div>
    )
}

export default Accounts