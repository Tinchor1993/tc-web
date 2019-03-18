import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isEmpty, isObject, isEqual } from 'lodash'
import Page from '../../../Dashboard/Components/Page/Page'

import { formValueSelector, submit, getFormValues } from 'redux-form'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  setStep,
  createLesson,
  updateLesson,
  setLessonData,
  initLessonEditForm,
  setActiveSlide,
  getSingle as getLesson
} from '../../Actions/LessonsActions'

import { getList as getSubjectsList } from '../../../Subjects/Actions/SubjectActions'

import LessonCreationProgress from '../../Components/LessonCreationProgress/LessonCreationProgress'
import WizardPages from '../../Components/WizardPages'
import Loading from '../../../Dashboard/Components/Loading/Loading'

import quizLayouts from '../../../Presentation/Constants/quizLayouts'

import {
  INFO,
  PRESENTATION,
  SORTING,
  QUIZ,
  ORDERING,
  INVITE
} from '../../Constants/steps'

import { DEFAULT_SLIDE } from '../../Components/WizardPages/PresentationPage/PresentationPage'

class LessonEditPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()

    this.onNext = this.onNext.bind(this)
    this.setActiveSlide = this.setActiveSlide.bind(this)
    this.jumpTo = this.jumpTo.bind(this)
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs(this.props)
    this.props.updateBreadcrumbs(breadcrumbs)

    this.props.getSubjectsList()

    if (this.isEditMode()) {
      this.props.getLesson(this.props.id)
    } else {
      const lesson = this.getInitialValue()
      this.props.initLessonEditForm(lesson)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.isEditMode() && !isEmpty(nextProps.lesson)) {
      this.props.initLessonEditForm(nextProps.lesson)
      const breadcrumbs = this.getBreadcrumbs(nextProps)
      this.props.updateBreadcrumbs(breadcrumbs)
    }
  }

  getBreadcrumbs(props) {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      },
      {
        path: '/dashboard/lessons',
        label: 'Lessons'
      },
      {
        path: `/dashboard/lessons/${props.lesson.id}`,
        label: this.isEditMode() ? `Edit "${props.lesson.titleEn}"` : 'Create'
      }
    ]
  }

  isEditMode() {
    return !!this.props.id
  }

  onSave = () => {
    const { wizardData, id } = this.props
    let data = wizardData

    if (this.isEditMode()) {
      this.props.updateLesson(id, data)
    } else {
      this.props.createLesson(data)
    }
  }

  onNext(formData) {
    const { activeStep } = this.props
    let nextStep = ''

    switch (activeStep) {
      case INFO:
        nextStep = PRESENTATION
        break

      case PRESENTATION:
        nextStep = SORTING
        break

      case SORTING:
        nextStep = QUIZ
        break

      case QUIZ:
        nextStep = ORDERING
        break

      case ORDERING:
        nextStep = INVITE
        break
    }

    if (activeStep === INVITE) {
      this.onSave()
    } else {
      this.props.setStep(nextStep)
    }
  }

  setActiveSlide(index) {
    this.props.setActiveSlide(index)
  }

  jumpTo(step) {
    this.props.setStep(step)
  }

  getInitialValue() {
    return {
      titleEn: '',
      draft: true,
      result: {
        onSuccess: {
          text: ''
        },
        onFailure: {
          text: ''
        }
      },
      sorting: {
        timeValue: 'sec',
        hasTimer: true,
        time: 30,
        bucket: '',
        question: '',
        background: '',
        elements: [],
        successes: [],
        fails: [],
        trash: ''
      },
      standards: [],
      subject:
        (this.props.query.subjectId &&
          JSON.parse(this.props.query.subjectId)) ||
        '',
      objectivesEn: '',
      titleEs: '',
      preview: '',
      objectivesEs: '',
      ordering: [
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
      ],
      quiz: {
        layout: 'list',
        answers: []
      },
      elements: [],
      presentation: {
        slides: [DEFAULT_SLIDE]
      },
      invite: {
        students: []
      }
    }
  }

  render() {
    const {
      id,
      activeStep,
      activeSlideIndex,
      lesson,
      subjects,
      loading,
      wizardData
    } = this.props

    if (this.isEditMode() && loading) {
      return <Loading />
    }

    return (
      <div className="container">
        <LessonCreationProgress activeStep={activeStep} onClick={this.jumpTo} />

        <Page title="Create Lesson">
          <WizardPages
            activeStep={activeStep}
            activeSlideIndex={activeSlideIndex}
            setActiveSlideIndex={this.setActiveSlide}
            subjects={subjects}
            onNext={this.onNext}
          />

          <div className="row">
            <br />
            <div className="pull-right">
              <button
                type="submit"
                className="btn-thc medium"
                onClick={this.onSave}
              >
                Save
              </button>
            </div>
          </div>
        </Page>
      </div>
    )
  }
}

const presSelector = formValueSelector('lessonPresentation')
const questionSelector = formValueSelector('lessonQuestions')

export default connect(
  state => ({
    wizardData: getFormValues(`wizard`)(state),
    lessonInfoData: getFormValues(`lessonInfo`)(state),

    subjects: state.subjects.getIn(['grid', 'list']).toJS() || [],

    activeStep: state.lessons.getIn(['creation', 'activeStep']) || INFO,
    activeSlideIndex: state.lessons.getIn(['creation', 'activeSlideIndex']),
    lesson: state.lessons.getIn(['active', 'current']).toJS() || {},
    loading: state.lessons.getIn(['active', 'loading']),

    lessonPresentationValues: presSelector(state, 'slides'),
    lessonQuestionsValues: questionSelector(state, 'answers')
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getLesson,
        setStep,
        createLesson,
        updateLesson,
        setLessonData,

        initLessonEditForm,
        setActiveSlide,
        getSubjectsList
      },
      dispatch
    )
)(LessonEditPage)
