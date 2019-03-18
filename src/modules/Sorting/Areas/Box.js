import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import classNames from 'classnames'
import ItemTypes from './ItemTypes'
import './SortingContainer.scss'

const boxSource = {
  beginDrag(props) {
    const { id, left, top } = props
    return { id, left, top }
  },

  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult()
    if (!dropResult) return

    const isTrash = dropResult.name === 'TrashArea'

    if (dropResult) {
      if (isTrash) {
        props.onTrash(props)
      } else {
        props.onDrop(props)
      }
    }
  }
}

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Box extends Component {
  constructor() {
    super()
    this.state = {
      isVisible: false
    }
  }

  componentDidMount() {
    this.setState({ isVisible: true })
  }

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired
  }

  render() {
    const { isDragging, connectDragSource, visible } = this.props
    const {
      titleEn,
      media,
      isCorrect,
      top,
      left,
      hideSourceOnDrag,
      pipePosition = 'top'
    } = this.props
    const { isVisible } = this.state
    if (isDragging && hideSourceOnDrag) {
      return null
    }

    return connectDragSource(
      <div
        className={classNames(
          'element-item animated',
          { bounceInDown: isVisible && pipePosition === 'top' },
          { bounceInRight: isVisible && pipePosition === 'right' }
        )}
        style={{ left, top }}
      >
        <div className="element-content">
          <div className="element-name">{titleEn}</div>
          <img src={media} alt="" />
        </div>
      </div>
    )
  }
}

export default Box
