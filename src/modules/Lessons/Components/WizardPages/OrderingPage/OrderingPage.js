import update from 'react/lib/update'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { Field, reduxForm, change } from 'redux-form'
import './OrederingPage.scss'
import { connect } from 'react-redux'

const OrderPartItem = ({ title }) => (
  <div className="order-part-item">
    <div className="index" />
    <div className="inner">
      <div className="spin" />
      <div className="">
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
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props

    return connectDragSource(
      connectDropTarget(
        <div>
          <OrderPartItem title={title} />
        </div>
      )
    )
  }
}

const LessonOrderingForm = props => {
  const { handleSubmit, children, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className="order-container">
        {children}
        <div className="row">
          <div className="pull-right">
            <button type="submit" className="btn-thc medium">
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

const validate = values => {
  const err = {}
  return err
}

const LessonOrderingFormContainer = reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(LessonOrderingForm)

@DragDropContext(HTML5Backend)
@connect(state => ({}), { change })
class OrderingPage extends Component {
  constructor(props) {
    super(props)
    this.moveCard = this.moveCard.bind(this)
    this.submit = this.submit.bind(this)
    this.state = {
      cards: [
        {
          id: 1,
          title: 'Presentation'
        },
        {
          id: 4,
          title: 'Quiz Mode'
        },
        {
          id: 5,
          title: 'Sorting Mode'
        }
      ]
    }
  }

  orderParts() {
    const { parts = [] } = this.props

    return parts.sort((p1, p2) => p1.order - p2.order)
  }

  componentWillUpdate(nextProps, nextState) {
    const { cards } = nextState
    this.props.change('wizard', 'ordering', cards)
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state
    const dragCard = cards[dragIndex]

    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    )
  }

  submit() {
    let data = this.state.cards.map((d, index) => {
      d.index = index
      return d
    })

    this.props.onNext(data)
  }

  render() {
    const { cards } = this.state

    return (
      <LessonOrderingFormContainer onSubmit={this.submit}>
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            title={card.title}
            moveCard={this.moveCard}
          />
        ))}
      </LessonOrderingFormContainer>
    )
  }
}

export default OrderingPage
