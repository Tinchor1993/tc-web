import React from 'react'
import './QuizToolBar.scss'

const QuizToolBar = ({ logout }) => (
  <div className="quiz-toolbar">
    <div className="container-fluid">
      <div className="col-md-4">
        <span>Thinking Cap App</span>
      </div>

      <div className="col-md-2 pull-right text-right">
        <button className="sing-out-btn" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>
  </div>
)

export default QuizToolBar
