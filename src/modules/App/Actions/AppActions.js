export const UPDATE_PAGE_TITLE = 'UPDATE_PAGE_TITLE'

/**
 * PAGE TITLE
 */
export function updatePageTitle(title) {
  return {
    type: UPDATE_PAGE_TITLE,
    payload: {
      title
    }
  }
}
