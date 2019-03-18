import React, { Component, PropTypes } from 'react'

import ContentContainer from '../../../../App/Containers/ContentContainer/ContentContainer'
import DemoFormContainer from '../../Forms/Containers/DemoFormContainer/DemoFormContainer'

import { default as DataTypesForm } from '../../Forms/DataTypesForm'

export class ValidationExamplesRoute extends Component {
  static propTypes = {}

  constructor() {
    super()
  }

  render() {
    return (
      <ContentContainer
        title="Forms Examples"
        backTo="/examples"
        id="validation-forms-examples"
      >
        <DemoFormContainer
          title="System Data Types Validation Form"
          description="System Data Types Validation"
        >
          <DataTypesForm />
        </DemoFormContainer>
      </ContentContainer>
    )
  }
}

export default ValidationExamplesRoute
