import React from 'react'

const animations = [
  {
    value: 'none',
    label: 'None',
    preview: 'https://image.flaticon.com/icons/svg/25/25235.svg'
  },
  {
    value: 'tada',
    label: 'Tada',
    preview: 'https://image.flaticon.com/icons/svg/109/109638.svg'
  },
  {
    value: 'bounceIn',
    label: 'BounceIn',
    preview: 'http://www.flaticon.com/premium-icon/icons/svg/109/109634.svg'
  },
  {
    value: 'fadeIn',
    label: 'FadeIn',
    preview: 'http://www.flaticon.com/premium-icon/icons/svg/109/109621.svg'
  },
  {
    value: 'fadeOut',
    label: 'FadeOut',
    preview: 'https://image.flaticon.com/icons/svg/109/109620.svg'
  },
  {
    value: 'flip',
    label: 'Flip',
    preview: 'http://www.flaticon.com/premium-icon/icons/svg/109/109646.svg'
  },
  {
    value: 'rotateIn',
    label: 'RotateIn',
    preview: 'http://www.flaticon.com/premium-icon/icons/svg/109/109626.svg'
  },
  {
    value: 'rotateOut',
    label: 'RotateOut',
    preview: 'http://www.flaticon.com/premium-icon/icons/svg/109/109626.svg'
  },
  {
    value: 'slideInUp',
    label: 'SlideInUp',
    preview: 'https://image.flaticon.com/icons/svg/109/109637.svg'
  },
  {
    value: 'slideInDown',
    label: 'SlideInDown',
    preview: 'https://image.flaticon.com/icons/svg/109/109633.svg'
  },
  {
    value: 'slideInLeft',
    label: 'SlideInLeft',
    preview: 'http://www.flaticon.com/premium-icon/icons/svg/109/109632.svg'
  },
  {
    value: 'slideInRight',
    label: 'SlideInRight',
    preview: 'http://www.flaticon.com/premium-icon/icons/svg/109/109632.svg'
  }
]

export const OptionRender = option => (
  <div>
    <img src={option.preview} width={18} height={18} />
    {'  '}
    <span>{option.label}</span>
  </div>
)

export default animations
