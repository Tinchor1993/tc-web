import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from '../../../../Dashboard/Components/Loading/Loading'
import {
  Field,
  reduxForm,
  FieldArray,
  formValues,
  formValueSelector
} from 'redux-form'
import {
  renderInput,
  AutocompleteField,
  CreatableField,
  SelectField,
  markDeleted
} from '../../../../Forms'

const STUDENTS_ENDPOINT = `/api/v1/students/all`
import './InvitePage.scss'

export const FORM_KEY = 'wizard'

const NEW = {
  label: 'New',
  value: 'new'
}

const EXIST = {
  label: 'Exist',
  value: 'exist'
}

const DEFAULT_STUDENT = {
  type: EXIST.value
}

const TYPES = [NEW, EXIST]

const renderStudent = ({ student, index, onDelete, type }) => (
  <div className="answer-form-group">
    <Field
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      name={`${student}.type`}
      component={renderInput}
      componentType={SelectField}
      options={TYPES}
    />
    {type === 'new' ? (
      <div className="row">
        <div className="col-md-3">
          <Field
            name={`${student}.name`}
            component="input"
            type="text"
            placeholder="Name"
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <Field
            name={`${student}.surname`}
            component="input"
            type="text"
            placeholder="Surname"
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <Field
            name={`${student}.email`}
            component="input"
            type="email"
            placeholder="Email"
            className="form-control"
          />
        </div>
      </div>
    ) : (
      <Field
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        name={`${student}.id`}
        component={renderInput}
        componentType={AutocompleteField}
        endpoint={STUDENTS_ENDPOINT}
        labelKey={'fullName'}
        idKey={'id'}
        old={true}
      />
    )}

    <button
      type="button"
      title="Add Answer"
      className="btn-cross remove-student"
      onClick={() => onDelete(index, true)}
    >
      <i className="glyphicon glyphicon-remove" />
    </button>
  </div>
)

const renderStudents = ({ fields, onDelete, getStudentType }) => (
  <div className="add-answer">
    <button
      type="button"
      onClick={() => fields.push(DEFAULT_STUDENT)}
      className="btn-thc small "
    >
      <i className="icon ti-plus" /> Add Student
    </button>
    <div>
      {fields.map((student, index, fields) => {
        if (fields.get(index).isDeleted) {
          return <div key={index} />
        }
        return (
          <div key={index}>
            {renderStudent({
              student,
              index,
              onDelete,
              fields,
              type: getStudentType(index)
            })}
          </div>
        )
      })}
    </div>
  </div>
)

const InviteForm = props => {
  const {
    handleSubmit,
    pristine,
    reset,
    submitting,
    subjects,
    students = [],
    onRemove
  } = props

  const deleteStudent = (index, v) =>
    onRemove(FORM_KEY, 'invite.students', index, v)

  const getStudentType = index => students[index] && students[index].type

  return (
    <form onSubmit={handleSubmit}>
      <label className="answer-label">Students:</label>

      <FieldArray
        name="invite.students"
        component={renderStudents}
        onDelete={deleteStudent}
        getStudentType={getStudentType}
      />
    </form>
  )
}

const validate = values => {
  const err = {}

  return err
}

const InviteFormContainer = reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(InviteForm)

class InvitePage extends Component {
  render() {
    const { markDeleted, onNext, invite = {} } = this.props
    const { students, loading } = this.props

    return (
      <div className="invite-container">
        {loading ? (
          <Loading />
        ) : (
          <InviteFormContainer
            initialValues={invite}
            onRemove={markDeleted}
            onSubmit={onNext}
            students={students}
          />
        )}
      </div>
    )
  }
}

const selector = formValueSelector('wizard')

export default connect(
  state => ({
    students: selector(state, `invite.students`),
    loading: state.lessons.getIn(['creation', 'loading'])
  }),
  dispatch =>
    bindActionCreators(
      {
        markDeleted
      },
      dispatch
    )
)(InvitePage)
