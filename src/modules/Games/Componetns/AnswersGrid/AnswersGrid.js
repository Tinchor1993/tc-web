import React from "react"
import classNames from "classnames"
import {
  isPicture,
  isVideo,
  isAudio
} from "../../../Forms/FileUploadField/FileUploadField"

import "./AnswersGrid.scss"
import renderText from "../../../utils/renderText"

export const renderFile = src => {
  if (isVideo(src)) {
    return <video style={{ width: `100%` }} controls src={src} />
  }

  if (isAudio(src)) {
    return <audio style={{ width: `100%` }} controls src={src} />
  }

  if (isPicture(src)) {
    return (
      <div
        className="quiz-answer-image"
        style={{ height: `200px`, "background-image": `url("${src}")` }}
      >
        {" "}
      </div>
    )
  }

  return <div>Unsupported file type</div>
}

const AnswersGrid = ({
  answers = [],
  onAnswerClick,
  answered,
  elements,
  showDescription = false
}) => (
  <div className="answer-grid text-center col-md-offset-2 col-md-10">
    {answers.map((answer, index) => (
      <div key={index} className="col-md-3 answer-item">
        <button
          className={classNames("web-app-btn-answer animated", {
            "correct pulse": answered && answer.isCorrect,
            "incorrect wobble": answered && !answer.isCorrect
          })}
          onClick={() => onAnswerClick(answer)}
        >
          {elements ? (
            <span>
              {renderFile(answer.element.media)}
              <p>{renderText(answer.element.titleEn, <p>Choose</p>)}</p>
            </span>
          ) : (
            <span>
              {renderFile(answer.media)}
              <p>{renderText(answer.text, <p>Choose</p>)}</p>
            </span>
          )}
        </button>
        <p>{elements && showDescription && answer.element.descriptionEn}</p>
      </div>
    ))}
  </div>
)

export default AnswersGrid
