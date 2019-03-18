/**
 * Created by syxou on 01.06.17.
 */
import React from 'react'
import { Link } from 'react-router'
import './ElementsToolBar.scss'
import '../../../../styles/components/buttons.scss'
import FilterElement from '../../Forms/ToolBarForm/'

const ElementsToolBar = () => (
  <div className="elements-tool-bar">
    <div className="row">
      <div className="col-md-3">
        <div className="row">
          <div className="col-md-6">
            <p>Elements</p>
          </div>
          <div className="col-md-6">
            <Link className="btn-thc medium" to="/dashboard/elements/new/edit">
              Create
            </Link>
          </div>
        </div>
      </div>
      <div>{/*<FilterElement />*/}</div>
    </div>
  </div>
)
export default ElementsToolBar
