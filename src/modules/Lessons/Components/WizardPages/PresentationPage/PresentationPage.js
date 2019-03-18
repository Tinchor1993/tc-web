import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Field,
  FieldArray,
  reduxForm,
  formValues,
  formValueSelector
} from 'redux-form'
import './PresentationPage.scss'
import { isEmpty } from 'lodash'
import {
  renderInput,
  SelectField,
  FileUploadField,
  TextareaField,
  LayoutToggleField,
  ToggleField,
  CheckboxField,
  AudioUploadField
} from '../../../../Forms'
import animations, {
  OptionRender as animateOptionComponent
} from '../../../../Presentation/Constants/animation'
import min from '../../../../Forms/Normalize/min'

import SlideCard from '../../../Components/SlideCard/SlideCard'

import { applyToAllSlides } from '../../../Actions/LessonsActions'

export const DEFAULT_SLIDE = {
  type: 'text',
  text: '',
  media: null,
  settings: {
    layout: 'TEXT',
    background: null,
    animation: 'none',
    textSize: 20,
    textDelay: 10,
    imageDelay: 12
  }
}

const validate = values => {
  const errors = {}
  return errors
}

const SlideContentField = ({ activeSlideIndex, settings: { layout } }) => {
  if (layout === 'TEXT') {
    return (
      <div className="row">
        <div className="col-md-12">
          <Field
            name={`presentation.slides[${activeSlideIndex}].text`}
            type="text"
            styles={{
              wrapper: 'form-group',
              label: 'control-label',
              hasError: 'has-error'
            }}
            label="Text"
            component={renderInput}
            className="form-control custom-input"
            componentType={TextareaField}
            style={{ minHeight: 80, maxHeight: 120 }}
            textarea={true}
          />

          <label htmlFor="">Audio</label>
          <Field
            name={`presentation.slides[${activeSlideIndex}].additionalAudio`}
            component={renderInput}
            componentType={AudioUploadField}
          />
        </div>
      </div>
    )
  }

  if (layout === 'MEDIA') {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <Field
              name={`presentation.slides[${activeSlideIndex}].media`}
              folder="slides"
              component={FileUploadField}
            />
            <div className="form-group">
              <label htmlFor="">Audio</label>
              <Field
                name={`presentation.slides[${
                  activeSlideIndex
                }].additionalAudio`}
                component={renderInput}
                componentType={AudioUploadField}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'ALL') {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <Field
              name={`presentation.slides[${activeSlideIndex}].text`}
              type="text"
              styles={{
                wrapper: 'form-group',
                label: 'control-label',
                hasError: 'has-error'
              }}
              label="Text"
              component={renderInput}
              className="form-control custom-input"
              componentType={TextareaField}
              style={{ minHeight: 80, maxHeight: 120 }}
              textarea={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <Field
                name={`presentation.slides[${activeSlideIndex}].media`}
                folder="slides"
                component={FileUploadField}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Audio</label>
              <Field
                name={`presentation.slides[${
                  activeSlideIndex
                }].additionalAudio`}
                component={renderInput}
                componentType={AudioUploadField}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <div>`{layout}` Non supported type!</div>
}

const renderSlides = ({
  fields,
  onClick,
  applyToAll,
  activeSlideIndex,
  activeSlide
}) => (
  <div className="row">
    <div className="col-md-3">
      <button
        type="button"
        className="btn-thc full"
        onClick={() => {
          fields.push(DEFAULT_SLIDE)
          onClick(fields.length)
        }}
      >
        Create Slide <i className="ti-back-left" />
      </button>

      <div className="slide-container">
        {fields.map((slide, index) => (
          <div
            key={index}
            className={classNames('slide', {
              active: activeSlideIndex === index
            })}
          >
            <div className="index">{index + 1}</div>
            <SlideCard
              {...fields.get(index)}
              onRemove={() => fields.remove(index)}
              onClick={() => onClick(index)}
            />
          </div>
        ))}
      </div>
    </div>

    <div className="col-md-6">
      {activeSlide && (
        <div>
          <Field
            name={`presentation.slides[${activeSlideIndex}].settings.layout`}
            component={LayoutToggleField}
          />
          <div className="presentation-form-container">
            <SlideContentField
              {...activeSlide}
              layout={activeSlide.settings.layout}
              activeSlideIndex={activeSlideIndex}
            />
          </div>
        </div>
      )}
    </div>

    <div className="col-md-3">
      <label>Presentation background music</label>
      <Field
        name="presentation.backgroundMusic"
        component={renderInput}
        componentType={AudioUploadField}
      />

      <Field
        name={`presentation.slides[${activeSlideIndex}].settings.animation`}
        component={renderInput}
        componentType={SelectField}
        className={'custom-input'}
        label="Slide animation"
        options={animations}
        optionRenderer={animateOptionComponent}
        valueRenderer={animateOptionComponent}
      />

      <label>Text delay</label>
      <Field
        name={`presentation.slides[${activeSlideIndex}].settings.textDelay`}
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        label="Text delay"
        className="form-control custom-input"
        component="input"
        type="number"
        normalize={min(0)}
      />
      <label>Image delay</label>
      <Field
        name={`presentation.slides[${activeSlideIndex}].settings.imageDelay`}
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        label="Image delay"
        className="form-control custom-input"
        component="input"
        type="number"
        normalize={min(0)}
      />

      <label>Slide background</label>
      <Field
        name={`presentation.slides[${
          activeSlideIndex
        }].settings.backgroundImage`}
        className={'custom-input'}
        component={renderInput}
        folder="slides"
        componentType={FileUploadField}
      />
      <label className="color-label">Slide background color</label>
      <Field
        name={`presentation.slides[${
          activeSlideIndex
        }].settings.backgroundColor`}
        component="input"
        type="color"
        className="form-control color-input"
      />
      <div className="row">
        <div className="col-md-8">
          <div className="form-grup">
            <label htmlFor="textSize" className="color-label">
              Text{'  '}
              <small>size / color</small>
            </label>

            <Field
              name={`presentation.slides[${
                activeSlideIndex
              }].settings.textSize`}
              id="text-size"
              component="input"
              type="number"
              className="form-control custom-input"
              normalize={min(12)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <Field
            name={`presentation.slides[${activeSlideIndex}].settings.textColor`}
            component="input"
            type="color"
            className="form-control color-input"
          />
        </div>
      </div>

      <div>
        <button
          type="button"
          className="btn-thc small full btn-apply"
          onClick={e => {
            const nextSettings = fields.getAll().map(field => ({
              ...activeSlide.settings,
              layout: field.settings.layout
            }))
            applyToAll(nextSettings)
          }}
        >
          <i className="ti-wand" /> Apply to all
        </button>
      </div>
    </div>
  </div>
)

const LessonPresentation = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  const {
    activeSlideIndex,
    setActiveSlideIndex,
    activeSlide,
    applyToAll
  } = props
  return (
    <form onSubmit={handleSubmit}>
      <FieldArray
        name="presentation.slides"
        component={renderSlides}
        onClick={setActiveSlideIndex}
        activeSlideIndex={activeSlideIndex}
        activeSlide={activeSlide}
        applyToAll={applyToAll}
        rerenderOnEveryChange={true}
      />

      <div className="row">
        <div className="pull-right">
          <button type="submit" className="btn-thc medium">
            Next
          </button>
        </div>
      </div>
    </form>
  )
}

const LessonPresentationFormContainer = reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(LessonPresentation)

class PresentationPage extends React.Component {
  apply = settings => {
    const count = settings.length
    const index = this.props.activeSlideIndex
    this.props.applyToAllSlides(settings, index, count)
  }

  render() {
    const {
      presentation = {},
      activeSlideIndex,
      setActiveSlideIndex,
      key,
      onNext,
      activeSlide,
      active
    } = this.props

    return (
      <div key={key}>
        <LessonPresentationFormContainer
          initialValues={presentation}
          onSubmit={onNext}
          activeSlideIndex={activeSlideIndex}
          setActiveSlideIndex={setActiveSlideIndex}
          activeSlide={activeSlide}
          applyToAll={this.apply}
        />
      </div>
    )
  }
}

const selector = formValueSelector('wizard')

export default connect(
  (state, ownProps) => {
    const { activeSlideIndex } = ownProps

    return {
      activeSlide: selector(state, `presentation.slides[${activeSlideIndex}]`)
    }
  },
  d =>
    bindActionCreators(
      {
        applyToAllSlides
      },
      d
    )
)(PresentationPage)
