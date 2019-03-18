import React from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import './ElementsCard.scss'

const ElementCard = ({
  id,
  titleEn,
  descriptionEn,
  media,
  hasAudio,
  hasVideo
}) => (
  <Link to={`/dashboard/elements/` + id}>
    <div className="element-card">
      <div className="media">
        <div className="media-left media-middle element-media">
          {media === null ? (
            <div className="media-object empty">
              <i className="ti-file" />
            </div>
          ) : (
            <img className="media-object" src={media} alt={titleEn} />
          )}
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            {titleEn}
            {hasAudio && <i className="ti-volume" />}
            {hasVideo && (
              <i className="glyphicon glyphicon-facetime-video video-icon" />
            )}
          </h4>
          <p>{descriptionEn}</p>
        </div>
      </div>
    </div>
  </Link>
)
export default ElementCard
