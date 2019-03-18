import React from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import Page from '../../../Dashboard/Components/Page/Page'
import './ElementDetails.scss'
import '../../../../styles/components/buttons.scss'

const renderFile = src => {
  if (isEmpty(src) || src === 'null') return <span>Empty</span>

  return <img src={src} alt="" />
}

const ElementDetails = ({
  id,
  titleEn,
  type,
  folder,
  descriptionEn,
  media,
  onDelete,
  creationDate
}) => (
  <Page>
    <div className="element-details">
      <h3>Element Details</h3>

      <p>Element name</p>
      <p className="element-info title">{titleEn}</p>

      <p>Element Folders</p>
      <p className="element-info type">{folder && folder.label}</p>

      <p>Description</p>
      <p className="element-info description">
        {descriptionEn === 'null' ? (
          <span>Empty</span>
        ) : (
          <span> {descriptionEn}</span>
        )}
      </p>

      <p>Media</p>
      <div className="element-info">{renderFile(media)}</div>
    </div>

    <div className="row">
      <div className="buttons pull-right">
        <Link
          className=" tch-link medium"
          to={`/dashboard/elements/${id}/edit`}
        >
          Edit
        </Link>
        <button
          className="btn-thc btn-thc-danger medium"
          onClick={() => onDelete(id, creationDate)}
        >
          Delete
        </button>
      </div>
    </div>
  </Page>
)
export default ElementDetails
