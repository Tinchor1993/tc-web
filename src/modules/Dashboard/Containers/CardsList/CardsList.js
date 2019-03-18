import React, { Component } from 'react'

Array.prototype.insert = function(index) {
  this.splice.apply(
    this,
    [index, 0].concat(Array.prototype.slice.call(arguments, 1))
  )
  return this
}

class CardsList extends Component {
  getCreateCardComponent() {
    return this.props.createCard
  }

  getCardComponent() {
    return this.props.cardComponent
  }

  insertInIndex(index, items, object) {
    return items.insert(index, object)
  }

  getCardPerRow() {
    return this.props.cardPerRow
  }

  formatList(list = []) {
    let formattedList = list.map(li => li)

    const l = formattedList.length
    const cardPerRow = this.getCardPerRow()

    if (l > cardPerRow) {
      formattedList = this.insertInIndex(cardPerRow, formattedList, {
        create: true
      })
    } else {
      formattedList.push({ create: true })
    }

    return formattedList
  }

  render() {
    const { list, id, perRow = 3 } = this.props

    const formattedList = this.formatList(list)
    const cardComponent = this.getCardComponent()
    const createCardComponent = this.getCreateCardComponent()

    return (
      <div className={`card-list ${id}`}>
        {formattedList.map((card, index) => {
          if (card.create) {
            return createCardComponent({ key: index })
          }

          return cardComponent({ ...card, key: index })
        })}
      </div>
    )
  }
}

export default CardsList
