import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'

const FlashMessage = ({ flashMessage, onDismiss }) => {
    const { visible } = flashMessage
    if (visible) {
        return (
            <div className="container">
                <Alert bsStyle="danger" onDismiss={() => onDismiss()}>
                    {flashMessage.title ?
                        <h3>{flashMessage.title}</h3> : ""}
                    <p>{flashMessage.text}</p>
                </Alert>
            </div>
        )
    }
    return <div></div>
}

export default FlashMessage