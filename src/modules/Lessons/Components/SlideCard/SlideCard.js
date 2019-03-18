import React from 'react'
import { noop, isEmpty } from 'lodash'
import {
  isAudio,
  isVideo,
  isPicture
} from '../../../Forms/FileUploadField/FileUploadField'

import './SlideCard.scss'

export const renderFile = (src = '') => {
  if (isVideo(src)) {
    return (
      <div>
        <i className="ti-clip" />
        <span>Video</span>
      </div>
    )
  }

  if (isAudio(src)) {
    return (
      <div>
        <i className="ti-music-alt" />
        <span>Audio</span>
      </div>
    )
  }

  if (isPicture(src)) {
    return <img src={src} style={{ width: `100%`, height: `auto` }} />
  }

  return <div>Unsupported file type</div>
}

const SlideCard = ({
  text = 'slide',
  settings: {
    layout,
    delay,
    animation,
    backgroundImage,
    backgroundColor,
    textSize,
    textDelay,
    textColor
  },
  media,
  question,
  onRemove,
  onClick = noop
}) => {
  let content = <p>`{layout}` Non supported type!</p>

  if (layout === 'TEXT') {
    content = (
      <div>
        <div className="animation">
          {!isEmpty(delay) && delay + 's /'} {animation}
        </div>
        <p
          style={{
            fontSize: `${textSize}px`,
            animationDuration: `${textDelay}s`,
            color: `${textColor}`
          }}
        >
          {text}
        </p>
        {onRemove && (
          <i
            className="slide-close glyphicon glyphicon-remove"
            onClick={onRemove}
          />
        )}
      </div>
    )
  }

  if (layout === 'MEDIA') {
    content = (
      <div>
        <div className="animation">
          {!isEmpty(delay) && delay + 's /'} {animation}
        </div>
        <div className="slide-media">{media && renderFile(media)}</div>
        {onRemove && (
          <i
            className="slide-close glyphicon glyphicon-remove"
            onClick={onRemove}
          />
        )}
      </div>
    )
  }

  if (layout === 'ALL') {
    content = (
      <div>
        <div className="animation">
          {!isEmpty(delay) && delay + 's /'} {animation}
        </div>
        <div className="slide-media">{media && renderFile(media)}</div>
        <p
          style={{
            fontSize: `${textSize}px`,
            animationDuration: `${textDelay}s`,
            color: `${textColor}`
          }}
        >
          {text}
        </p>
        {onRemove && (
          <i
            className="slide-close glyphicon glyphicon-remove"
            onClick={onRemove}
          />
        )}
      </div>
    )
  }

  return (
    <div
      className="slide-card"
      onClick={onClick}
      style={{
        backgroundImage: `url(${backgroundImage ? backgroundImage : ''})`,
        backgroundColor: `${backgroundColor ? backgroundColor : ''}`
      }}
    >
      {content}
    </div>
  )
}

export default SlideCard
