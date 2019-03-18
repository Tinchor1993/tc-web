import React from 'react'
import './style.scss'

const backgrounds = [
  {
    label: 'default',
    value: 'default',
    image: '/images/game-backgrounds/paper.png'
  },

  {
    label: 'paper',
    value: 'paper.png',
    image: '/images/game-backgrounds/paper.png'
  },
  {
    label: 'paper1',
    value: 'paper1.jpg',
    image: '/images/game-backgrounds/paper1.png'
  },
  {
    label: 'paper2',
    value: 'paper2.jpg',
    image: '/images/game-backgrounds/paper2.png'
  },
  {
    label: 'wood',
    value: 'wood.jpg',
    image: '/images/game-backgrounds/wood.png'
  },
  {
    label: 'wood1',
    value: 'wood1.jpg',
    image: '/images/game-backgrounds/wood1.png'
  }
]
export const OptionRender = option => (
  <div className="name-bg">
    <img src={option.image} width={190} height={40} />
    {'  '}
    <div>
      <span>{option.label}</span>
    </div>
  </div>
)

export default backgrounds
