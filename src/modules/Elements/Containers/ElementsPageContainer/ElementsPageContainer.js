import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'
import { browserHistory } from 'react-router'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Page from '../../../Dashboard/Components/Page/Page'
import ElementsList from '../../Components/ElementsList/ElementsList'
import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  getList as getElements,
  changeFolder,
  getFolders,
  removeFolder
} from '../../Actions/ElementListActions'

import Loading from '../../../Dashboard/Components/Loading/Loading'

import ElementsToolBar from '../../Components/ElementsToolBar/ElementsToolBar'
import './ElementsPageContainer.scss'
import FOLDER_ALL from '../../Constants/folders'

class ElementsPageContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()
    this.showToggle = this.showToggle.bind(this)
    this.isFolderActive = this.isFolderActive.bind(this)
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.state = {
      showDelete: false,
      folderToDelete: null
    }
  }

  init(props) {
    const { activeFolder } = props
    const meta = {
      folder: activeFolder
    }

    this.props.getFolders(meta)
    this.props.getElements(meta)
  }

  showToggle() {
    const { showDelete } = this.state
    this.setState({ showDelete: !showDelete })
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs()
    this.props.updateBreadcrumbs(breadcrumbs)
    this.change = this.change.bind(this)

    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeFolder !== this.props.activeFolder) {
      const { activeFolder } = nextProps
      const meta = {
        folder: activeFolder
      }
      this.props.getElements(meta)
    }
  }

  getBreadcrumbs() {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      },
      {
        path: '/dashboard/elements',
        label: 'Elements'
      }
    ]
  }

  extendColumns(columns) {
    return columns.map(col => {
      if (col.accessor === 'titleEs') {
        col.render = row => this.titleColumnRender(row, 'titleEs')
      }

      if (col.accessor === 'titleEn') {
        col.render = row => this.titleColumnRender(row, 'titleEn')
      }

      return col
    })
  }

  titleColumnRender(row, key) {
    return <Link to={`/dashboard/elements/${row.row.id}`}>{row.row[key]}</Link>
  }

  onAddClick() {
    browserHistory.push('/dashboard/elements/create')
  }

  change(type) {
    this.props.changeFolder(type)
  }

  isFolderActive(id) {
    const { activeFolder } = this.props
    return id === activeFolder
  }

  showModal(id, title) {
    this.setState({ showDelete: true, folderToDelete: { id, title } })
  }

  closeModal() {
    this.setState({ showDelete: false })
  }

  removeFolder() {
    const { folderToDelete } = this.state
    const { id } = folderToDelete

    this.props.removeFolder(id)
  }

  render() {
    const { list, loading, folders } = this.props
    const { showDelete, folderToDelete } = this.state
    return (
      <div className="container">
        {showDelete && (
          <ModalContainer onClose={this.closeModal}>
            <ModalDialog onClose={this.closeModal}>
              <div className="modal-container">
                <h2>Delete {folderToDelete.title} folder?</h2>
                <button
                  className="btn-thc small"
                  onClick={() => {
                    this.closeModal()
                    this.removeFolder()
                  }}
                >
                  Ok
                </button>
                <button
                  className="btn-thc-danger small"
                  onClick={this.closeModal}
                >
                  Cancel
                </button>
              </div>
            </ModalDialog>
          </ModalContainer>
        )}

        <Page>
          <ElementsToolBar />

          <div className="row">
            <div className="col-md-8">
              {loading ? <Loading /> : <ElementsList elements={list} />}
            </div>
            <div className="col-md-4">
              <div className="folder-container">
                <h3 className="folders-title">Folders</h3>
                <div
                  className={classNames('folder', {
                    active: this.isFolderActive(FOLDER_ALL)
                  })}
                  onClick={() => this.change(FOLDER_ALL)}
                >
                  <i className="ti-folder" />
                  All
                </div>
                {folders.map(({ id, title }, index) => (
                  <div
                    key={index}
                    className={classNames('folder', {
                      active: this.isFolderActive(id)
                    })}
                    onClick={() => this.change(id)}
                  >
                    <i className="ti-folder" />
                    {title}
                    <i
                      className="ti-trash delete-icon"
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        this.showModal(id, title)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Page>
      </div>
    )
  }
}

export default connect(
  state => ({
    activeFolder: state.elements.getIn(['folders', 'active']),
    folders: state.elements.getIn(['folders', 'data', 'list']).toJS() || [],
    loading: state.elements.getIn(['grid', 'loading']) || false,
    list: state.elements.getIn(['grid', 'list']).toJS() || []
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getElements,
        changeFolder,
        getFolders,
        removeFolder
      },
      dispatch
    )
)(ElementsPageContainer)
