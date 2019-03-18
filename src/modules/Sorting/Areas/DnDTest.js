import React, { Component } from 'react'
import SortingContainer from './SortingContainer'

class SortingArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      elementsToShow: [],
      tryNumber: []
    }

    this.onSuccess = this.onSuccess.bind(this)
    this.showedElements = this.showedElements.bind(this)
    this.moveToTrash = this.moveToTrash.bind(this)
  }

  componentDidMount() {
    const { elements } = this.props
    this.setElements(this.showedElements())
  }

  setElements(elements) {
    this.setState({ elementsToShow: elements })
  }

  showedElements() {
    const { elements = [], perRow } = this.props
    let { elementsToShow } = this.state
    if (!elementsToShow.length || elementsToShow.length > elements.length) {
      if (perRow >= elements.length) {
        elementsToShow = elements
      } else {
        elementsToShow = elements.slice(0, perRow)
      }

      const tries = elementsToShow.map(() => 0)

      this.setState({ tryNumber: tries })
      this.setElements(elementsToShow)
    }
    return elementsToShow
  }

  onSuccess = (el, index) => {
    const { onSuccess } = this.props
    let { elementsToShow, tryNumber } = this.state
    elementsToShow = elementsToShow.filter((element, key) => {
      return key !== index
    })
    const newTries = tryNumber.filter((tryElem, key) => {
      return key !== index
    })
    this.setState({
      tryNumber: newTries
    })
    console.log(elementsToShow)
    this.setElements(elementsToShow)
    onSuccess(el, index)
    this.showedElements()
  }

  onError = index => {
    const { tryNumber, elementsToShow } = this.state
    const { tryCount = 2 } = this.props
    if (tryNumber[index] === undefined) {
      tryNumber[index] = 0
    } else {
      tryNumber[index] = tryNumber[index] + 1
    }
    if (tryNumber[index] >= tryCount) {
      //TODO add functional for fail count
      this.props.moveToTrash(index)
      const elemList = elementsToShow.filter((element, key) => {
        return key !== index
      })
      const newTries = tryNumber.filter((tryElem, key) => {
        return key !== index
      })
      this.setState({
        tryNumber: newTries
      })
      this.setElements(elemList)
      this.showedElements()
    } else {
      this.setState({
        tryNumber
      })
    }

    this.props.onError()
  }

  moveToTrash = (el, index) => {
    const { moveToTrash } = this.props
    let { elementsToShow } = this.state
    if (!el.isCorrect) {
      elementsToShow = elementsToShow.filter((element, key) => {
        return key !== index
      })
      this.setElements(elementsToShow)
    }
    moveToTrash(index)
    this.showedElements()
  }

  render() {
    const {
      title,
      elements,
      bucket,
      perRow,
      targetArea,
      pipePosition,
      tryCount
    } = this.props
    const { elementsToShow, tryNumber } = this.state
    const { onError } = this.props
    return (
      <div>
        <h2>{title}</h2>
        
        {elementsToShow.length && (
          <SortingContainer
            elements={elementsToShow}
            bucket={bucket}
            tryCount={tryCount}
            pipePosition={pipePosition}
            targetArea={targetArea}
            hideSourceOnDrag={true}
            onSuccess={this.onSuccess}
            onError={this.onError}
            moveToTrash={this.moveToTrash}
          />
        )}
      </div>
    )
  }
}
export default SortingArea
