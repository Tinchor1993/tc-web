import React, { Component, PropTypes } from 'react'

import ContentContainer from '../../../../App/Containers/ContentContainer/ContentContainer'
import DemoFormContainer from '../../Forms/Containers/DemoFormContainer/DemoFormContainer'

import { default as BasicExampleForm } from '../../Forms/Basic'
// import {default as BasicExampleForm} from '../../Forms/Basic';

export class FormExamplesRoute extends Component {
  static propTypes = {}

  constructor() {
    super()
  }

  render() {
    return (
      <ContentContainer
        title="Forms Examples"
        backTo="/examples"
        id="forms-examples"
      >
        <DemoFormContainer
          title="Basic Form"
          description="Form with default config"
        >
          <BasicExampleForm />
        </DemoFormContainer>

        <DemoFormContainer
          title="Fields types"
          description="Fields with almost system supported types."
        >
          advanced
        </DemoFormContainer>

        <DemoFormContainer
          title="Form Fields Validation"
          description="Present supported fields validation."
        >
          validation
        </DemoFormContainer>

        <DemoFormContainer
          title="Form with Reducer controller"
          description="Forms state validates / controls by redux reducer."
        >
          decorator
        </DemoFormContainer>
      </ContentContainer>
    )
  }
}

export default FormExamplesRoute
