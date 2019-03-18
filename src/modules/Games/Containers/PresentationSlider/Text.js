import React from 'react'

const Text = ({
  text,
  additionalAudio = {},
  stopPlaying,
  isLocalPlaying,
  settings: {
    textSize,
    textDelay,
    textColor,
    backgroundImage,
    backgroundColor,
    imageDelay
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
      <p
        className="fadeIn"
        style={{
          fontSize: `${textSize}px`,
          animationDuration: `${textDelay}s`,
          color: `${textColor}`
        }}
      >
        {text}{' '}
      </p>
    </div>

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
)

export default Text
