import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Debug from '../../../../../Framework/Debug'

export class CompanyAddressesFormContainer extends Component {
  static propTypes = {
    values: PropTypes.object,
    config: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const {
      values = {},
      config = {},
      title,
      description,
      children
    } = this.props

    return (
      <div className="demo-form-container row container">
        <div className="col-md-10 col-md-offset-2">
          <h3>{title}</h3>
          {description ? (
            <p>
              <mark>{description}</mark>
            </p>
          ) : null}
          <div className="col-md-6">{children}</div>
          <div className="col-md-3">
            Initial Config
            <Debug data={config} />
          </div>
          <div className="col-md-3">
            Values
            <Debug data={values} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    // values: getFormValues(ownProps.formKey)(state)
  }),
  dispatch => bindActionCreators({}, dispatch)
)(CompanyAddressesFormContainer)
