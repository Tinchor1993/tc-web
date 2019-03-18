import React from 'react'

import InfoPage from './InfoPage/InfoPage'
import OrderingPage from './OrderingPage/OrderingPage'
import PresentationPage from './PresentationPage/PresentationPage'
import QuizPage from './QuizPage/QuizPage'
import SortingPage from './SortingPage/SortingPage'
import InvitePage from './InvitePage/InvitePage'

import {
  INFO,
  PRESENTATION,
  SORTING,
  QUIZ,
  ORDERING,
  INVITE
} from '../../Constants/steps'

import Wizard from '../../../Framework/Wizard'

const LessonCreationProgress = ({
  activeStep = INFO,
  activeSlideIndex = 0,
  setActiveSlideIndex,
  lesson = {},
  subjects,
  onNext
}) => (
  <div>
    <Wizard activeKey={activeStep}>
      <InfoPage
        key={[INFO]}
        info={lesson}
        onNext={onNext}
        subjects={subjects}
      />

      <PresentationPage
        key={[PRESENTATION]}
        activeSlideIndex={activeSlideIndex}
        setActiveSlideIndex={setActiveSlideIndex}
        presentation={lesson.presentation}
        onNext={onNext}
      />

      <SortingPage key={[SORTING]} parts={lesson.sorting} onNext={onNext} />

      <QuizPage key={[QUIZ]} quiz={lesson.quiz} onNext={onNext} />

      <OrderingPage key={[ORDERING]} parts={lesson.parts} onNext={onNext} />

      <InvitePage key={[INVITE]} onNext={onNext} invite={lesson.invite} />
    </Wizard>
  </div>
)

export default LessonCreationProgress
