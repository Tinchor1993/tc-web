import React, { PropTypes } from 'react'

import { LessonCard, LessonCardCreate } from '../'

import CardList from '../../../Dashboard/Containers/CardsList/CardsList'

const LessonsList = ({ lessons }) => (
  <CardList
    id="lessons"
    cardPerRow={2}
    list={lessons}
    cardComponent={LessonCard}
    createCard={LessonCardCreate}
  />
)

export default LessonsList
