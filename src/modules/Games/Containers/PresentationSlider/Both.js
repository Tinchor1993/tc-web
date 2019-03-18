/**
 * Created by syxou on 17/06/2017.
 */
import React from 'react'
import './SlidesStyle.scss'
import {
  isAudio,
  isVideo,
  isPicture
} from '../../../Forms/FileUploadField/FileUploadField'

export const renderFile = (media, imageDelay, stopPlaying, isLocalPlaying) => {
  if (isVideo(media)) {
    return (
      <video
        controls
        src={media}
        onPlay={stopPlaying}
        onPause={stopPlaying}
        style={{ animationDuration: `${imageDelay}s` }}
      />
    )
  }

  if (isAudio(media)) {
    return (
      <audio
        onPlay={stopPlaying}
        autoPlay={isLocalPlaying}
        onPause={stopPlaying}
        controls
        src={media}
        style={{ animationDuration: `${imageDelay}s` }}
      />
    )
  }

  if (isPicture(media)) {
    return (
      <img
        className="fadeIn"
        style={{ animationDuration: `${imageDelay}s` }}
        src={media}
        alt="Photo sliders"
      />
    )
  }

  return <div>Unsupported file type</div>
}

const Both = ({
  media,
  isLocalPlaying,
  additionalAudio = {},
  text,
  stopPlaying,
  settings: {
    textSize,
    textDelay,
    imageDelay,
    textColor,
    backgroundImage,
    backgroundColor
  }
}) => (
  <div
    className="slider-background"
    style={{
      backgroundImage: `url(${backgroundImage ? backgroundImage : ''})`,
      backgroundColor: `${backgroundColor ? backgroundColor : ''}`
    }}
  >
    <div className="slider-title">
      <div className="photo-vertical">
        {renderFile(media, imageDelay, stopPlaying, isLocalPlaying)}
        {additionalAudio.src &&
          isLocalPlaying && (
            <div className="additional-audio">
              <audio
                autoPlay={isLocalPlaying}
                loop={additionalAudio.repeat}
                onPlay={stopPlaying}
                onEnded={stopPlaying}
                src={additionalAudio.src}
                style={{ animationDuration: `${imageDelay}s` }}
              />
            </div>
          )}
      </div>
      <p
        className="fadeIn"
        style={{
          fontSize: `${textSize}px`,
          animationDuration: `${textDelay}s`,
          color: `${textColor}`
        }}
      >
        {text}
      </p>
    </div>
  </div>
)
export default Both
