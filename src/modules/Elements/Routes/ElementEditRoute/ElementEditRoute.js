import React, { Component, PropTypes } from 'react'

import ElementEditPageContainer from '../../Containers/ElementEditPageContainer/ElementsEditPageContainer'

class ElementEditRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { params } = this.props
    const { id } = params

    return (
      <div className="container">
        <ElementEditPageContainer id={id} />
      </div>
    )
  }
}

export default ElementEditRoute
