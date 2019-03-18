import React, { Component } from 'react'

import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './SortingPage.scss'
import { isEmpty } from 'lodash'
import backgrounds from '../../../../Presentation/Constants/backgrounds'
import trashs from '../../../../Presentation/Constants/trash'

import {
  renderInput,
  CheckboxField,
  AutocompleteField,
  FileUploadField,
  SelectField,
  TextareaField,
  CreatableField,
  AudioUploadField,
  markDeleted
} from '../../../../Forms'

import {
  OptionRender as LayoutOptionRenderer,
  isText,
  isMedia,
  isTextMedia,
  sortingLayouts
} from '../../../../Presentation/Constants/quizLayouts'
import classNames from 'classnames'

export const FORM_KEY = 'lessonSorting'

const validate = values => {
  const errors = {}

  if (isEmpty(values.question)) {
    errors.question = 'Direction cannot be empty'
  }

  return errors
}

const intNormalize = value => Math.floor(value)

export const TOP = {
  value: 'top',
  label: 'Top',
  icon: 'ti-arrow-up'
}

export const RIGHT = {
  value: 'right',
  label: 'Right',
  icon: 'ti-arrow-right'
}

const pipeOptions = [TOP, RIGHT]
const pipeRotateOptions = [
  {
    value: '-180',
    label: '-180°',
    icon: 'ti-line-dotted'
  },
  {
    value: '-90',
    label: '-90°',
    icon: 'ti-line-dotted'
  },
  {
    value: '-45',
    label: '-45°',
    icon: 'ti-line-dotted'
  },
  {
    value: '0',
    label: '0°',
    icon: 'ti-line-dotted'
  },
  {
    value: '+45',
    label: '+45°',
    icon: 'ti-line-dotted'
  },
  {
    value: '+90',
    label: '+90°',
    icon: 'ti-line-dotted'
  },
  {
    value: '+180',
    label: '+180°',
    icon: 'ti-line-dotted'
  },
  {
    value: '360',
    label: '360°',
    icon: 'ti-line-dotted'
  }
]

const Background = ({ background, children }) =>
  background ? (
    <div
      className="sorting-container"
      style={{ background: `url("${background}")` }}
    >
      {children}
    </div>
  ) : (
    <div />
  )

const renderPipeOptions = option => (
  <div>
    <span className={option.icon} />
    {'  '}
    <span>{option.label}</span>
  </div>
)

const renderSubFields = (el, index, fields) => (
  <li className="elements-sorting" key={index}>
    <Field
      name={`${el}.isCorrect`}
      component={renderInput}
      componentType={CheckboxField}
    />

    <img src={fields.get(index).media} alt={fields.get(index).titleEn} />

    <button
      className="bt-elements-remove glyphicon glyphicon-remove"
      type="button"
      title="Remove Element"
      onClick={() => fields.remove(index)}
    />
  </li>
)
const renderElements = ({ fields }) => (
  <ul className="element-array col-md-12">
    <AutocompleteField
      placeholder="Type to search..."
      defaultValue={' '}
      autoload={true}
      endpoint={'/api/v1/elements'}
      labelKey={'titleEn'}
      idKey={'id'}
      input={{
        value: '',
        onChange: (id, item) => {
          fields.push(item)
        }
      }}
    />

    {fields.map(renderSubFields)}
  </ul>
)

const renderTextResponse = (member, index, fields) => (
  <div key={index}>
    <Field
      name={`${member}.text`}
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      component={renderInput}
      className="form-control"
      componentType={TextareaField}
    />
    <button
      className="btn-thc-danger small remove-option"
      type="button"
      onClick={() => fields.remove(index)}
    >
      remove
    </button>
  </div>
)

const renderAudioResponse = (member, index, fields) => (
  <div key={index}>
    <Field
      name={`${member}.audio`}
      component={renderInput}
      componentType={AudioUploadField}
      defaultOn={true}
      attributes={false}
    />
    <button
      type="button"
      className="btn-thc-danger small remove-option"
      onClick={() => fields.remove(index)}
    >
      remove
    </button>
  </div>
)

const renderBothResponse = (member, index, fields) => (
  <div key={index}>
    <Field
      name={`${member}.text`}
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      component={renderInput}
      label="Text"
      className="form-control"
      componentType={TextareaField}
    />

    <label>Audio</label>
    <Field
      name={`${member}.audio`}
      component={renderInput}
      componentType={AudioUploadField}
      defaultOn={true}
      attributes={false}
    />
    <button
      type="button"
      className="btn-thc-danger small remove-option"
      onClick={() => fields.remove(index)}
    >
      remove
    </button>
    <hr />
  </div>
)

const getLayoutRenderer = layout => {
  if (isText(layout)) return renderTextResponse
  if (isMedia(layout)) return renderAudioResponse
  if (isTextMedia(layout)) return renderBothResponse

  return renderTextResponse
}

const renderResponses = ({ fields, label, layout, ...other }) => {
  let responseRenderer = getLayoutRenderer(layout)

  return (
    <div>
      {layout ? (
        <div className="col-md-6 text-center">
          <button
            type="button"
            className="btn-thc small"
            onClick={() => fields.push({})}
          >
            Add <b>{label}</b> Response
          </button>
          <div className="response-items-wrapper">
            {fields.map(responseRenderer)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const LessonSortingForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  const { responseLayout, settings } = props
  return (
    <form onSubmit={handleSubmit}>
      <h4>Sorting Mode</h4>

      <div className="form-group">
        <div className="form-sorting ">
          <Field
            name="sorting.question"
            styles={{
              wrapper: 'form-group',
              label: 'control-label',
              hasError: 'has-error'
            }}
            component={renderInput}
            className="form-control question-form"
            textarea={true}
            placeholder="Quiz question?"
            componentType={TextareaField}
            style={{ minHeight: 80, maxHeight: 120 }}
          />
        </div>
        <div>
          <Field
            label={`Response Layout`}
            name={`sorting.responseLayout`}
            component={renderInput}
            componentType={SelectField}
            className={'custom-input'}
            options={sortingLayouts}
            optionRenderer={LayoutOptionRenderer}
            valueRenderer={LayoutOptionRenderer}
          />
        </div>
        <div className="row">
          <FieldArray
            name="sorting.successes"
            component={renderResponses}
            label="Success"
            layout={responseLayout}
          />

          <FieldArray
            name="sorting.fails"
            component={renderResponses}
            label="Fail"
            layout={responseLayout}
          />
        </div>
      </div>

      <div className="row select-preview">
        <div className="col-md-12">
          <Background background={settings.background}>
            {settings.pipe && (
              <img
                src={settings.pipe}
                className={`sorting-pipe ${
                  settings.pipePosition && settings.pipePosition === 'right'
                    ? 'right'
                    : 'top'
                }`}
                style={{
                  transform: `rotate(${settings.pipeRotate}deg)`
                }}
                alt=""
              />
            )}

            <div className={classNames('target-area animated')}>
              <img src={settings.targetArea} className="bg-img" />
            </div>

            <div className={classNames('target-area trash-area animated')}>
              <img src={settings.bucket} className="bg-img" />
            </div>
          </Background>
        </div>
      </div>

      <div className="row select-container">
        <div className="col-md-12">
          <label>Background Music</label>
          <Field
            name="sorting.backgroundMusic"
            component={renderInput}
            componentType={AudioUploadField}
          />
        </div>
        <div className="col-md-3 attr">
          <Field
            label="Background"
            name="sorting.background"
            component={renderInput}
            componentType={FileUploadField}
            folder="sorting"
            placeholder="Background"
          />
        </div>
        <div className="col-md-3 attr">
          <Field
            label="Correct Area"
            name="sorting.targetArea"
            component={renderInput}
            componentType={FileUploadField}
            folder="sorting"
            placeholder="Correct Area"
          />
        </div>
        <div className="col-md-3 attr">
          <Field
            label="Trash bucket area"
            name="sorting.bucket"
            component={renderInput}
            componentType={FileUploadField}
            folder="sorting"
            placeholder="Trash bucket"
          />
        </div>
        <div className="col-md-3 attr">
          <Field
            label="Pipe Image"
            name="sorting.pipe"
            component={renderInput}
            componentType={FileUploadField}
            folder="sorting"
            placeholder="Image on Top"
          />
          <Field
            label="Pipe Position"
            name="sorting.pipePosition"
            component={renderInput}
            componentType={SelectField}
            className={'custom-input'}
            options={pipeOptions}
            optionRenderer={renderPipeOptions}
            valueRenderer={renderPipeOptions}
          />
          <Field
            label="Pipe Rotate"
            name="sorting.pipeRotate"
            component={renderInput}
            componentType={SelectField}
            className={'custom-input'}
            options={pipeRotateOptions}
            optionRenderer={renderPipeOptions}
            valueRenderer={renderPipeOptions}
          />
        </div>
      </div>
      <div className="row">
        <label htmlFor="" className="elements-label">
          Elements
        </label>

        <div className="sorting-form-container">
          <div className="row">
            <div className="col-md-3">
              <Field
                name="sorting.perRow"
                styles={{
                  wrapper: 'form-group',
                  label: 'control-label',
                  hasError: 'has-error'
                }}
                component={renderInput}
                className="form-control question-form"
                textarea={false}
                label="Elements per row"
                type="number"
                normalize={intNormalize}
                defaultValue={2}
              />
            </div>
            <div className="col-md-3">
              <Field
                name="sorting.tryCount"
                styles={{
                  wrapper: 'form-group',
                  label: 'control-label',
                  hasError: 'has-error'
                }}
                component={renderInput}
                className="form-control question-form"
                textarea={false}
                label="Try Count per element"
                type="number"
                normalize={intNormalize}
                defaultValue={2}
              />
            </div>
            <br />
          </div>
          <div className="row">
            <div className="col-md-2">
              <label>Add Element</label>
            </div>
            <FieldArray
              name="sorting.elements"
              component={renderElements}
              className="form-control"
            />
          </div>
        </div>

        <div className="pull-right">
          <button type="submit" className="btn-thc medium">
            Next
          </button>
        </div>
      </div>
    </form>
  )
}

const LessonSortingFormContainer = reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(LessonSortingForm)

class SortingPage extends Component {
  render() {
    const { parts, key, onNext } = this.props
    const { responseLayout, sortingSettings } = this.props
    const settings = sortingSettings.sorting

    return (
      <div key={key}>
        <LessonSortingFormContainer
          onSubmit={onNext}
          initialValues={parts}
          responseLayout={responseLayout}
          settings={settings}
        />
      </div>
    )
  }
}

const selector = formValueSelector('wizard')

export default connect(
  (state, ownProps) => ({
    responseLayout: selector(state, `sorting.responseLayout`),
    sortingSettings: selector(
      state,
      'sorting.background',
      'sorting.targetArea',
      'sorting.bucket',
      'sorting.pipe',
      'sorting.pipePosition',
      'sorting.pipeRotate'
    )
  }),
  d => bindActionCreators({}, d)
)(SortingPage)
