import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import classNames from 'classnames'

const boxTarget = {
  drop() {
    return { name: 'TrashArea' }
  }
}

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class TrashArea extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  }

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props
    const { bucket } = this.props
    const isActive = canDrop && isOver

    return connectDropTarget(
      <div
        className={classNames('target-area trash-area animated', {
          pulse: isActive
        })}
      >
        <img src={bucket} className="bg-img" />
      </div>
    )
  }
}

export default TrashArea
