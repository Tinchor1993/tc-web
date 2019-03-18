import React from 'react'

const isTextSlide = type => type === 'text'

const printMedia = media => <div>{media}</div>

const SlideLeft = () => <div>{'<'}</div>

const SlideRight = () => <div>{'>'}</div>

const SlideArrow = ({ left }) => {
  if (left) {
    return <SlideLeft />
  }

  return <SlideRight />
}

export default SlideArrow
