/**
 * Created by Andrew on 29.05.2017.
 */
import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const Create = title => (
  <Link to="/dashboard/subjects/new/edit">
    <div className="lesson-create-tite col-md-4">
      <div className="inner">
        <div>
          <h2>Create {title}</h2>
        </div>
        <div className=" col-md-offset-3">
          <button type="button" className="btn btn-success create-btn">
            <h1>+</h1>
          </button>
        </div>
      </div>
    </div>
  </Link>
)
export default Create
