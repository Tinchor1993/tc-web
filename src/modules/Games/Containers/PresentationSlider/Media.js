import React from 'react'
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
        onPlay={stopPlaying}
        onPause={stopPlaying}
        src={media}
        style={{ animationDuration: `${imageDelay}s` }}
      />
    )
  }

  if (isAudio(media)) {
    return (
      <div>
        {isLocalPlaying ? (
          <audio
            onPlay={stopPlaying}
            onPause={stopPlaying}
            autoPlay={true}
            controls
            src={media}
            style={{ animationDuration: `${imageDelay}s` }}
          />
        ) : (
          ''
        )}
      </div>
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
const Media = ({
  media,
  additionalAudio = {},
  stopPlaying,
  isLocalPlaying,
  settings: { backgroundImage, backgroundColor, imageDelay }
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
                onPlay={stopPlaying}
                onEnded={stopPlaying}
                src={additionalAudio.src}
                style={{ animationDuration: `${imageDelay}s` }}
                loop={additionalAudio.repeat}
              />
            </div>
          )}
      </div>
    </div>
  </div>
)

export default Media
