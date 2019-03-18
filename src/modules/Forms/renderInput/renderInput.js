import React from 'react'
import cx from 'classnames'

const renderInput = ({
  componentType,
  meta: { touched, error },
  label,
  styles = {},
  ...props
}) => {
  let component
  if (componentType) {
    const ComponentType = componentType
    component = <ComponentType {...props} />
  } else {
    const { input, ...rest } = props
    component = <input {...input} {...rest} placeholder={label} />
  }

  return (
    <div
      className={cx(styles.wrapper, { [styles.hasError]: error && touched })}
    >
      {label && <label className={cx(styles.label)}>{label}</label>}
      <div>
        {component}
        {touched && error && <span className="help-block">{error}</span>}
      </div>
    </div>
  )
}

export default renderInput
