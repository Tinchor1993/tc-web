import React from 'react'
import './QuizPage.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { change, formValueSelector } from 'redux-form'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { isEmpty } from 'lodash'

import {
  renderInput,
  CheckboxField,
  markDeleted,
  TextareaField,
  SelectField,
  FileUploadField,
  AutocompleteField,
  CreatableField,
  AudioUploadField,
  ElementField
} from '../../../../Forms'

import layouts, {
  OptionRender as LayoutOptionRenderer,
  isText,
  isMedia,
  isTextMedia,
  isElement
} from '../../../../Presentation/Constants/quizLayouts'

export const FORM_KEY = 'wizard'

const DEFAULT_ANSWER = {
  text: '',
  isCorrect: false
}

const DEFAULT_QUESTION = {
  text: ''
}

const validate = values => {
  const errors = {}

  if (isEmpty(values.text)) {
    errors.text = 'text cannot be empty'
  }

  if (isEmpty(values.question)) {
    errors.question = 'Question cannot be empty'
  }

  return errors
}

const renderTextAnswer = ({ answer, index, fields, deleteAnswers, questionIndex }) => (
  <div className="answer-form-group">
    <Field name={`${answer}.isCorrect`} component={renderInput} componentType={CheckboxField} className="checkbox" />
    <Field
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      name={`${answer}.text`}
      component={renderInput}
      className="form-control"
      componentType={TextareaField}
    />

    <button type="button" className="btn-cross" onClick={() => deleteAnswers(questionIndex, index, true)}>
      <i className="glyphicon glyphicon-remove" />
    </button>
  </div>
)

const renderMediaAnswer = ({ answer, index, fields, deleteAnswers, questionIndex }) => (
  <div className="answer-form-group grid-answers">
    <Field name={`${answer}.isCorrect`} component={renderInput} componentType={CheckboxField} className="checkbox" />
    {'  '}
    <Field
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      name={`${answer}.media`}
      component={renderInput}
      label="media"
      small={true}
      folder="slides"
      componentType={FileUploadField}
    />

    <button type="button" className="btn-cross" onClick={() => deleteAnswers(questionIndex, index, true)}>
      <i className="glyphicon glyphicon-remove" />
    </button>
  </div>
)

const renderElementAnswer = ({ answer, index, fields, deleteAnswers, questionIndex }) => (
  <div className="answer-form-group grid-answers">
    <Field name={`${answer}.isCorrect`} component={renderInput} componentType={CheckboxField} className="checkbox" />
    {'  '}
    <Field
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      name={`${answer}.element`}
      component={renderInput}
      label="Element"
      small={true}
      folder="slides"
      componentType={ElementField}
    />

    <button type="button" className="btn-cross" onClick={() => deleteAnswers(questionIndex, index, true)}>
      <i className="glyphicon glyphicon-remove" />
    </button>
  </div>
)

const renderTextAndMediaAnswer = ({ answer, index, fields, deleteAnswers, questionIndex }) => (
  <div className="answer-form-group grid-answers">
    <Field name={`${answer}.isCorrect`} component={renderInput} componentType={CheckboxField} className="checkbox" />
    {'  '}
    <Field
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      name={`${answer}.text`}
      component={renderInput}
      className="form-control"
      componentType={TextareaField}
    />
    <Field
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      name={`${answer}.media`}
      component={renderInput}
      label="media"
      small={true}
      folder="slides"
      componentType={FileUploadField}
    />

    <button type="button" className="btn-cross" onClick={() => deleteAnswers(questionIndex, index, true)}>
      <i className="glyphicon glyphicon-remove" />
    </button>
  </div>
)

const renderQuestion = ({ question, index, deleteQuestion, layout, deleteAnswers }) => (
  <div>
    <div className="row">
      <div className="col-md-2">
        <h4>Question #{index + 1}</h4>
      </div>
      <div className="col-md-3 pull-right">
        <button type="button" className="pull-right btn-thc-danger small" onClick={() => deleteQuestion(index, true)}>
          Delete question{' '}<i className={`glyphicon glyphicon-trash`} />
        </button>
      </div>
    </div>

    <br />

    <Field
      name={`${question}.text`}
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      label="Question"
      component={renderInput}
      className="form-control"
      textarea={true}
      componentType={TextareaField}
      style={{ minHeight: 80, maxHeight: 120 }}
    />

    <Field
      label="Layout"
      name={`${question}.layout`}
      component={renderInput}
      componentType={SelectField}
      className={'custom-input'}
      options={layouts}
      optionRenderer={LayoutOptionRenderer}
      valueRenderer={LayoutOptionRenderer}
    />

    {isElement(layout) && (
      <div className="checkbox">
        <label htmlFor={`showDescription` + index}>
          Show element description
          <Field
            component={renderInput}
            name={`${question}.showDescription`}
            id={`showDescription` + index}
            type="checkbox"
          />
        </label>
      </div>
    )}

    {layout ? (
      <div>
        <label className="answer-label">Answers:</label>
        <FieldArray
          name={`${question}.answers`}
          component={renderAnswers}
          layout={layout}
          deleteAnswers={deleteAnswers}
          questionIndex={index}
        />
      </div>
    ) : (
      <div>
        <b>Please, choose a layout for your answers.</b>
      </div>
    )}

    <hr />
  </div>
)

const renderQuestions = ({ fields, deleteQuestion, deleteAnswers }) => (
  <div>
    {fields.map((question, index, fields) => {
      if (fields.get(index).isDeleted) {
        return <div key={index} />
      }

      const layout = fields.get(index).layout

      return (
        <div key={index}>
          {renderQuestion({
            question,
            index,
            deleteQuestion,
            layout,
            deleteAnswers
          })}
        </div>
      )
    })}

    <br />
    <br />

    <button
      type="button"
      onClick={() => {
        fields.push(DEFAULT_QUESTION)
      }}
      className={`btn-thc small btn-block`}
    >
      <i className="icon ti-plus" /> Add Question
    </button>

    <br />
    <br />
  </div>
)

const renderAnswers = ({ fields, layout, deleteAnswers, questionIndex }) => (
  <div className="add-answer">
    <button type="button" onClick={() => fields.push(DEFAULT_ANSWER)} className="btn-thc small ">
      <i className="icon ti-plus" /> Add Answer
    </button>
    <div className="row">
      {fields.map((answer, index, fields) => {
        if (fields.get(index).isDeleted) {
          return <div key={index} />
        }
        return (
          <div key={index} className={!isText(layout) ? 'col-md-4' : ''}>
            {isText(layout) &&
              renderTextAnswer({
                answer,
                index,
                fields,
                deleteAnswers,
                questionIndex
              })}
            {isMedia(layout) &&
              renderMediaAnswer({
                answer,
                index,
                fields,
                deleteAnswers,
                questionIndex
              })}
            {isTextMedia(layout) &&
              renderTextAndMediaAnswer({
                answer,
                index,
                fields,
                deleteAnswers,
                questionIndex
              })}
            {isElement(layout) &&
              renderElementAnswer({
                answer,
                index,
                fields,
                deleteAnswers,
                questionIndex
              })}
          </div>
        )
      })}
    </div>
  </div>
)

const LessonQuestionsForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  const { onRemove } = props

  const deleteQuestion = (index, v) => {
    onRemove(FORM_KEY, 'quiz.questions', index, v)
  }

  const deleteAnswers = (questionIndex, answerIndex, v) => {
    onRemove(FORM_KEY, `quiz.questions[${questionIndex}].answers`, answerIndex, v)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="form-group question-text">
          <div>
            <FieldArray
              name={'quiz.questions'}
              component={renderQuestions}
              deleteQuestion={deleteQuestion}
              deleteAnswers={deleteAnswers}
              rerenderOnEveryChange={true}
            />
          </div>
          <label>Background Music</label>
          <Field name="quiz.backgroundMusic" component={renderInput} componentType={AudioUploadField} />
        </div>

        <div className="row">
          <div className="pull-right">
            <button type="submit" className="btn-thc medium add">
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

const LessonQuestionsFormContainer = reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(LessonQuestionsForm)

const QuizPage = ({ key, quiz, onNext, markDeleted }) => {
  //const layouts = questions.map((q,index) => q.layout)
  return (
    <div key={key}>
      <LessonQuestionsFormContainer onSubmit={onNext} initialValues={quiz} onRemove={markDeleted} />
    </div>
  )
}

export default connect(
  (state, ownProps) => ({}),
  dispatch =>
    bindActionCreators(
      {
        markDeleted
      },
      dispatch
    )
)(QuizPage)
