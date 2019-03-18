import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router'
import 'react-tabs/style/react-tabs.scss'
import './FormStyle.scss'
import { isEmpty } from 'lodash'

const NEW = {
  label: 'New',
  value: 'new'
}

const EXIST = {
  label: 'Exist',
  value: 'exist'
}

const TYPES = [NEW, EXIST]
import {
  renderInput,
  AutocompleteField,
  FileUploadField,
  TextareaField,
  SelectField
} from '../../../../modules/Forms'

const validate = values => {
  const errors = {}

  if (isEmpty(values.titleEn)) {
    errors.titleEn = 'Cannot be empty'
  }

  return errors
}

const EditElementForm = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  editMode,
  cancelLink,
  folderType
}) => (
  <form onSubmit={handleSubmit} className="elements-edit-form">
    <Field
      styles={{
        wrapper: 'form-group',
        label: 'control-label',
        hasError: 'has-error'
      }}
      name="titleEn"
      label="Element name"
      componentType={TextareaField}
      id="element-name"
      component={renderInput}
      className="form-control"
    />
    <div className="row">
      <div className="col-md-6">
        <Field
          styles={{
            wrapper: 'form-group',
            label: 'control-label',
            hasError: 'has-error'
          }}
          label="Folder type"
          name="folderType"
          component={renderInput}
          componentType={SelectField}
          options={TYPES}
        />
      </div>
      <div className="col-md-6">
        {folderType === 'new' ? (
          <Field
            name="newFolderName"
            styles={{
              wrapper: 'form-group',
              label: 'control-label',
              hasError: 'has-error'
            }}
            label="New folder name"
            component={renderInput}
            className="form-control"
            componentType={TextareaField}
          />
        ) : (
          <Field
            name="folder"
            styles={{
              wrapper: 'form-group',
              label: 'control-label',
              hasError: 'has-error'
            }}
            label="Existing Folders"
            component={renderInput}
            componentType={AutocompleteField}
            creatable={false}
            endpoint={'/api/v1/elements/folders'}
            addEndpoint={'/api/v1/elements/folders/'}
            labelKey={'title'}
            idKey={'id'}
          />
        )}
      </div>
    </div>
    <div className="form-group">
      <Field
        name="descriptionEn"
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        label="Description"
        component={renderInput}
        className="form-control"
        textarea={true}
        componentType={TextareaField}
        style={{ minHeight: 80, maxHeight: 120 }}
      />
    </div>

    <div className="form-group">
      <label htmlFor="media">Media</label>
      <Field
        name="media"
        folder="elements"
        component={FileUploadField}
        className="form-control"
      />
    </div>

    <div className="row">
      <div className="edit-from-btn-group pull-right">
        {editMode && (
          <button
            type="button"
            className="btn-thc-danger"
            disabled={submitting}
            onClick={reset}
          >
            Clear Values
          </button>
        )}
        {!editMode && (
          <Link to={cancelLink} className="btn-thc btn-thc-danger medium">
            Cancel
          </Link>
        )}{' '}
        <button
          type="submit"
          className="btn-thc medium btn-custom"
          disabled={submitting}
        >
          {editMode ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  </form>
)

export default reduxForm({
  form: 'editElement',
  validate
})(EditElementForm)
