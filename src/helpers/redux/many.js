const many = ({
  list = [],
  filter = {},
  page = 0,
  perPage = 10,
  total = 0,
  loading = true,
  loaded = false,
  error = null
}) => ({
  list,
  filter,

  page,
  perPage,
  total,

  loading,
  loaded,

  error
})

export default many
