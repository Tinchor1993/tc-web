const single = ({
  current = {},
  loading = true,
  loaded = false,
  error = null
}) => ({
  current,

  loading,
  loaded,

  error
})

export default single
