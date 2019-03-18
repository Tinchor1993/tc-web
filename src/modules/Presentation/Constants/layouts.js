import React from 'react'

export const ONLY_TITLE = {
  label: 'Only Title',
  value: 'ONLY_TITLE',
  icon: 'ti-layout-media-overlay-alt-2'
}
export const PHOTO_HORIZONTAL = {
  label: 'Media Horizontal',
  value: 'PHOTO_HORIZONTAL',
  icon: 'ti-layout-media-overlay-alt'
}
export const PHOTO_VERTICAL = {
  label: 'Media Vertical',
  value: 'PHOTO_VERTICAL',
  icon: 'ti-layout-sidebar-right'
}
export const QUOTE = {
  label: 'Quote',
  value: 'QUOTE',
  icon: 'ti-layout-cta-center'
}
export const TEXT = {
  label: 'Text',
  value: 'TEXT',
  icon: 'ti-layout-cta-center'
}
export const BLANK = {
  label: 'Blank',
  value: 'BLANK',
  icon: 'ti-layout-width-full'
}

export const OptionRender = option => (
  <div>
    <i className={option.icon} />
    {'  '}
    <span>{option.label}</span>
  </div>
)

const layouts = [
  ONLY_TITLE,
  PHOTO_HORIZONTAL,
  PHOTO_VERTICAL,
  QUOTE,
  BLANK,
  TEXT
]

const isType = (type, name) => type.value === name

export const isOnlyTitle = name => isType(ONLY_TITLE, name)
export const isPhotoHorizontal = name => isType(PHOTO_HORIZONTAL, name)
export const isPhotoVertical = name => isType(PHOTO_VERTICAL, name)
export const isQuote = name => isType(QUOTE, name)
export const isBlank = name => isType(BLANK, name)
export const isText = name => isType(TEXT, name)

export default layouts
