import React, { PropTypes } from 'react'
import ElementsToolBar from '../../Components/ElementsToolBar/ElementsToolBar'
import ElementCard from '../../Components/ElementCard/ElementCard'

const ElementsList = ({ elements = [] }) => (
  <div className="elements-list">
    {elements.map((el, index) => <ElementCard key={index} {...el} />)}
  </div>
)

export default ElementsList
