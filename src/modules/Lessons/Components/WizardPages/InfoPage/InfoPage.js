import React from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import './InfoPage.scss'
import { isEmpty } from 'lodash'

import {
  renderInput,
  AutocompleteField,
  FileUploadField,
  TextareaField,
  CheckboxField,
  CreatableField,
  ToggleField
} from '../../../../Forms'

const selector = formValueSelector('wizard')
const validate = values => {
  const errors = {}

  if (isEmpty(values.titleEn)) {
    errors.titleEn = 'Title cannot be empty'
  }
  return errors
}

const renderSubject = ({ label, data = {} }) => {
  const { preview } = data

  return (
    <div>
      {preview && <i className={`ti-${preview}`} />} {label}
    </div>
  )
}

let LessonInfoForm = props => {
  const {
    handleSubmit,
    pristine,
    reset,
    submitting,
    subjects,
    draft,
    testMode
  } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-4">
          <div className="lesson-cover form-group">
            <label htmlFor="titleEn">Preview</label>
            <Field
              name="preview"
              component={renderInput}
              componentType={FileUploadField}
              onlyAudio={false}
            />
          </div>
        </div>

        <div className="col-md-8">
          <Field
            name="draft"
            component={renderInput}
            componentType={ToggleField}
            label="Is Draft?"
            className="checkbox"
          />
          <div className="form-group">
            {draft ? (
              <span className="label label-danger">This lesson is draft</span>
            ) : (
              <span className="label label-success">
                This lesson is ready to use
              </span>
            )}
          </div>

          <Field
          name="testMode"
          component={renderInput}
          componentType={ToggleField}
          label="Test mode?"
          className="checkbox"
          />
          <div className="form-group">
          {testMode ? <span className="label label-warning">This lesson in test mode</span> :
          <span className="label label-primary">This lesson is ready</span>}
          </div>
          
          <Field
            name="subject"
            styles={{
              wrapper: 'form-group',
              label: 'control-label',
              hasError: 'has-error'
            }}
            label="Subject"
            component={renderInput}
            componentType={AutocompleteField}
            endpoint={'/api/v1/subjects/filter'}
            labelKey={'titleEn'}
            idKey={'id'}
            optionRenderer={renderSubject}
            valueRenderer={renderSubject}
          />

          {/*<Field*/}
          {/*name="standards"*/}
          {/*styles={{wrapper: 'form-group', label: 'control-label', hasError: 'has-error'}}*/}
          {/*label="Standards"*/}
          {/*component={renderInput}*/}
          {/*componentType={CreatableField}*/}
          {/*creatable={true}*/}
          {/*labelKey={'name'}*/}
          {/*idKey={'id'}*/}
          {/*multi={true}*/}
          {/*/>*/}

          <Field
            name="titleEn"
            styles={{
              wrapper: 'form-group',
              label: 'control-label',
              hasError: 'has-error'
            }}
            label="Title En"
            component={renderInput}
            className="form-control"
            componentType={TextareaField}
          />

          {/*<Field*/}
          {/*name="objectivesEn"*/}
          {/*styles={{wrapper: 'form-group', label: 'control-label', hasError: 'has-error'}}*/}
          {/*label="Objectives En"*/}
          {/*component={renderInput}*/}
          {/*className="form-control"*/}
          {/*textarea={true}*/}
          {/*componentType={TextareaField}*/}
          {/*style={{minHeight: 80, maxHeight: 120}}*/}
          {/*/>*/}

          <Field
            name="titleEs"
            styles={{ wrapper: 'form-group', hasError: 'hasError' }}
            label="Title Es"
            component={renderInput}
            className="form-control"
            componentType={TextareaField}
          />
          {/*<Field*/}
          {/*name="objectivesEs"*/}
          {/*styles={{wrapper: 'form-group', label: 'control-label', hasError: 'has-error'}}*/}
          {/*label="Objectives Es"*/}
          {/*component={renderInput}*/}
          {/*className="form-control"*/}
          {/*textarea={true}*/}
          {/*componentType={TextareaField}*/}
          {/*style={{ minHeight: 80, maxHeight: 120 }}*/}
          {/*/>*/}

          {/*<Field*/}
          {/*name="result.onSuccess.text"*/}
          {/*styles={{wrapper: 'form-group',label: 'control-label', hasError: 'has-error'}}*/}
          {/*label="Message on successful result"*/}
          {/*component={renderInput}*/}
          {/*className="form-control"*/}
          {/*componentType={TextareaField}*/}
          {/*/>*/}

          {/*<Field*/}
          {/*name="result.onFailure.text"*/}
          {/*styles={{wrapper: 'form-group',label: 'control-label', hasError: 'has-error'}}*/}
          {/*label="Message on failed result"*/}
          {/*component={renderInput}*/}
          {/*className="form-control"*/}
          {/*componentType={TextareaField}*/}
          {/*/>*/}
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

LessonInfoForm = reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(LessonInfoForm)

LessonInfoForm = connect(state => {
  const { draft, testMode } = selector(state, 'draft', 'testMode')
  return {
    draft,
    testMode
  }
})(LessonInfoForm)

const formatSubjects = subjects => {
  return subjects.map(subject => ({
    value: subject.id,
    label: subject.titleEn
  }))
}

const InfoPage = ({ info, key, subjects, onNext }) => (
  <div key={key}>
    <LessonInfoForm
      initialValues={info}
      onSubmit={onNext}
      subjects={formatSubjects(subjects)}
    />
  </div>
)

export default InfoPage
