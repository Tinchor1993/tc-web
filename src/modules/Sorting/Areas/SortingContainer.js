import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DragDropContextProvider, DragDropContext, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes'
import TargetArea from './TargetAra'
import Box from './Box'
import TrashArea from './Trash'
import './SortingContainer.scss'

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    const delta = monitor.getDifferenceFromInitialOffset()
    const left = Math.round(item.left + delta.x)
    const top = Math.round(item.top + delta.y)

    component.moveBox(item.id, left, top)
  }
}

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.BOX, boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
class SortingContainer extends Component {
  static propTypes = {
    hideSourceOnDrag: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired
  }

  constructor() {
    super()

    this.onElementDrop = this.onElementDrop.bind(this)
    this.moveToTrash = this.moveToTrash.bind(this)
  }

  onElementDrop(el, index) {
    const { isCorrect } = el
    if (isCorrect) {
      this.props.onSuccess(el, index)
    } else {
      this.props.onError(index)
    }
  }

  moveToTrash(el, index) {
    const { isCorrect } = el
    if (!isCorrect) {
      this.props.moveToTrash(el, index)
    } else {
      this.props.onError(index)
    }
  }

  render() {
    const { elements = [], bucket, pipePosition, targetArea } = this.props

    return (
      <div className="row">
        <div className="col-md-4">
          <TargetArea target={targetArea} />
        </div>

        <div className="col-md-8">
          <div className="element-container">
            {elements.map((el, index) => (
              <Box
                {...el}
                key={index}
                pipePosition={pipePosition}
                onTrash={() => {
                  this.moveToTrash(el, index)
                }}
                onDrop={() => {
                  this.onElementDrop(el, index)
                }}
                left={0 + index * 150}
                top={50}
                hideSourceOnDrag={true}
              />
            ))}
          </div>
        </div>

        <TrashArea bucket={bucket} />
      </div>
    )
  }
}

export default connect(
  () => ({}),
  dispatch => bindActionCreators({}, dispatch)
)(SortingContainer)
