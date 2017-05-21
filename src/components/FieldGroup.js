import React from 'react'
import { ControlLabel, FormControl, HelpBlock, FormGroup } from 'react-bootstrap'

const FieldGroup = ({id, label, help, validationState, ...props}) => {
    return (
        <FormGroup controlId={id} validationState={validationState}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    )
}

export default FieldGroup