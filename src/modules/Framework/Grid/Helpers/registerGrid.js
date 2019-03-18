import defaultConfig from './defaultConfig'

export const registerGrid = (state, name, config) => {
  const newGrid = {
    name,
    ...defaultConfig,
    ...config
  }

  return {
    ...state,
    [name]: newGrid
  }
}

export default registerGrid
