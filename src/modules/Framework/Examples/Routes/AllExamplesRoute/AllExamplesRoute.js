import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'
import ContentContainer from '../../../../App/Containers/ContentContainer/ContentContainer'

export class AllExamplesRoute extends Component {
  static propTypes = {}

  constructor() {
    super()
  }

  buildExamplsLinks(links) {
    return links.map((link, index) => (
      <div className="col-md-4">
        <Link key={index} to={`/examples${link.to}`}>
          <div className="thumbnail">
            <div className="caption">
              <h3>{link.title}</h3>
            </div>
          </div>
        </Link>
      </div>
    ))
  }

  render() {
    const links = [
      { to: '/forms', title: 'Forms' },
      { to: '/validation', title: 'Validation' },
      { to: '/grid', title: 'Grid' },
      { to: '/geo', title: 'GEO data' },
      { to: '/modals', title: 'Modals' }
    ]

    const examplesLinks = this.buildExamplsLinks(links)

    return (
      <ContentContainer
        title="Framework components examples"
        backTo="/dashboard"
        id="examples"
        fluid
      >
        <div className="row">{examplesLinks}</div>
      </ContentContainer>
    )
  }
}

export default AllExamplesRoute
