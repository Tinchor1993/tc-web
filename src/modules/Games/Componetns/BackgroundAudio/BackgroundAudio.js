import React from 'react'

const VOLUME_MAP = {
  quiet: 0.5,
  normal: 0.8,
  loud: 1
}

const BackgroundAudio = ({ music, loop, isPlaying, level = 'normal' }) => (
  <div>{isPlaying ? <audio loop={loop} src={music} autoPlay={true} volume={VOLUME_MAP[level]} /> : ''}</div>
)

BackgroundAudio.defaultProps = {
  isPlaying: true
}
export default BackgroundAudio
