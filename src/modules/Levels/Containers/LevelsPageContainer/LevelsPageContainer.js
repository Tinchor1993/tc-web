/**
 * Created by looch on 29/07/2017.
 */
import update from 'react/lib/update'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { findDOMNode } from 'react-dom'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from '../../../Dashboard/Components/Loading/Loading'
import './LevelsPageContainer.scss'
import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import { getList, updateLevel } from '../../Actions/LevelsActions'

const LevelPartItem = ({ title, index }) => (
  <div className="level-part-item">
    <div className="index" />
    <div className="inner">
      <div className="spin" />
      <div className="">
        {index + 1}
        <i className="glyphicon glyphicon-menu-hamburger" />
        {title}
      </div>
    </div>
  </div>
)
const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    }
  }
}

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  }
}

const ItemTypes = {
  CARD: 'card'
}

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired
  }

  render() {
    const {
      title,
      index,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props

    return connectDragSource(
      connectDropTarget(
        <div className="col-md-4">
          <LevelPartItem title={title} index={index} />
        </div>
      )
    )
  }
}
@DragDropContext(HTML5Backend)
class LessonsContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()

    this.state = {
      cards: []
    }
  }

  orderParts() {
    const { parts = [] } = this.props

    return parts.sort((p1, p2) => p1.order - p2.order)
  }

  moveCard = (dragIndex, hoverIndex) => {
    const { cards } = this.state
    const dragCard = cards[dragIndex]

    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    )

    const updateData = this.state.cards.map(({ id, creationDate }, index) => ({
      id,
      level: index,
      creationDate
    }))
    this.updateOrders(updateData)
  }

  componentDidMount() {
    const breadcrumbs = this.getBreadcrumbs()
    this.props.updateBreadcrumbs(breadcrumbs)
    this.props.getList()

    const meta = {}
  }

  updateOrders(data) {
    this.props.updateLevel(data)
  }

  componentWillReceiveProps(nextProps) {
    const { list } = nextProps
    this.updateCardList(list.sort((a, b) => a.level - b.level))
  }

  updateCardList(list) {
    this.setState({ cards: list })
  }

  getBreadcrumbs() {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      },
      {
        path: '/dashboard/levels',
        label: 'Levels'
      }
    ]
  }

  render() {
    const { loading } = this.props
    const { cards } = this.state
    return (
      <div className="container">
        {loading ? (
          <Loading />
        ) : (
          cards.map((item, i) => (
            <Card
              key={item.id}
              index={i}
              id={item.id}
              title={item.titleEn}
              moveCard={this.moveCard}
            />
          ))
        )}
      </div>
    )
  }
}

export default connect(
  state => ({
    loading: state.levels.getIn(['grid', 'loading']) || false,
    list: state.levels.getIn(['grid', 'list']).toJS() || []
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getList,
        updateLevel
      },
      dispatch
    )
)(LessonsContainer)
