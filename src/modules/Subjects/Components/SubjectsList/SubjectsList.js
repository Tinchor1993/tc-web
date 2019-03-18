import React, { PropTypes } from 'react'

import { SubjectCard, SubjectsCardCreate } from '../'

import CardList from '../../../Dashboard/Containers/CardsList/CardsList'

const SubjectsList = ({ subjects }) => (
  <CardList
    id="subjects"
    cardPerRow={2}
    list={subjects}
    cardComponent={SubjectCard}
    createCard={SubjectsCardCreate}
  />
)

export default SubjectsList
