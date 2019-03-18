import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import classNames from 'classnames'
import './SortingContainer.scss'

const boxTarget = {
  drop() {
    return { name: 'TargetAra' }
  }
}

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class TargetAra extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  }

  render() {
    const { canDrop, isOver, connectDropTarget, target } = this.props
    const isActive = canDrop && isOver

    return connectDropTarget(
      <div className={classNames('target-area animated', { pulse: isActive })}>
        <img src={target} className="bg-img" />
      </div>
    )
  }
}

export default TargetAra
