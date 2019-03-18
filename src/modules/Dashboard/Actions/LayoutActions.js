export const UPDATE_BREADCRUMBS = 'UPDATE_BREADCRUMBS'

export const updateBreadcrumbs = breadcrumbs => {
  return {
    type: UPDATE_BREADCRUMBS,
    payload: {
      breadcrumbs
    }
  }
}

export const getSingleLesson = id => {}
