import React from 'react'

export const TEXT = {
  value: 'text',
  label: 'Text',
  icon: 'ti-align-justify'
}

export const MEDIA = {
  value: 'media',
  label: 'Media',
  icon: 'ti-view-grid'
}

export const TEXT_MEDIA = {
  value: 'both',
  label: 'Both',
  icon: 'ti-layout-list-thumb-alt'
}

export const ELEMENTS = {
  value: 'elements',
  label: 'Elements',
  icon: 'ti-layout-grid2-alt'
}

const layouts = [TEXT, MEDIA, TEXT_MEDIA, ELEMENTS]
export const sortingLayouts = [TEXT, MEDIA, TEXT_MEDIA]

export const OptionRender = option => (
  <div>
    <span className={option.icon} />
    {'  '}
    <span>{option.label}</span>
  </div>
)

export const isType = (v, type) => {
  return v === type.value
}

export const isText = v => {
  return isType(v, TEXT)
}

export const isElement = v => {
  return isType(v, ELEMENTS)
}

export const isMedia = v => {
  return isType(v, MEDIA)
}

export const isTextMedia = v => {
  return isType(v, TEXT_MEDIA)
}

export default layouts
