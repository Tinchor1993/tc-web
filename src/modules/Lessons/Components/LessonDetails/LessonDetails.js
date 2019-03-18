import React from "react"
import "./LessonDetails.scss"
import { Link } from "react-router"
import classNames from "classnames"
import Page from "../../../Dashboard/Components/Page/Page"
import SlideCard from "../../Components/SlideCard/SlideCard"
import { isPicture } from "../../../Forms/FileUploadField/FileUploadField"

const renderFile = src => {
  if (isPicture(src)) {
    return <img src={src} style={{ width: `100%`, height: `auto` }} />
  }

  return <div>Unsupported file type</div>
}

const renderSlides = (slides = []) => {
  return slides.map((slide, index) => (
    <div key={index} className="col-md-2 slide-card-container">
      <SlideCard {...slide} />
      <div className="index">{index + 1}</div>
    </div>
  ))
}

const renderText = ({ text }) => <span>{text !== "null" && text}</span>

const renderMedia = ({ media }) => (
  <span className="answer-media">{media !== "null" && renderFile(media)} </span>
)

const renderElement = ({ element }) => (
  <span>
    {" "}
    {element !== "null" && element && <strong> {element.titleEn} </strong>}{" "}
  </span>
)

const renderAnswers = (answers = [], layout) => {
  return answers.map((answer = {}, index) => (
    <li
      key={index}
      className={classNames(`answer`, {
        correct: answer.isCorrect,
        incorrect: !answer.isCorrect
      })}
    >
      <i
        className={classNames({
          "ti-check": !!answer.isCorrect,
          "ti-face-sad": !answer.isCorrect
        })}
      />
      {layout === "text" && renderText(answer)}
      {layout === "media" && renderMedia(answer)}
      {layout === "both" && renderText(answer) && renderMedia(answer)}
      {layout === "elements" && renderElement(answer)}
    </li>
  ))
}
const renderQuestions = (questions = []) => {
  return questions.map((q = {}, index) => (
    <div key={index}>
      <h3 className="question-title">{q.text}</h3>
      {renderAnswers(q.answers, q.layout)}
    </div>
  ))
}

const renderStudents = (students = []) => {
  return students.map((student = {}, index) => (
    <li key={index}>{student.fullName}</li>
  ))
}

const LessonDetails = ({
  id,
  draft,
  titleEn = null,
  titleEs = null,
  objectivesEn = null,
  objectivesEs = null,
  hasAudio = false,
  hasVideo = false,
  sorting = {},
  preview = "",
  presentation = {},
  quiz = {},
  onRemove,
  creationDate,
  invite = {},
  active = false
}) => (
  <Page>
    <div className="lesson-details-container">
      <section className="lesson-name-section">
        <h3 className="lesson-details-title">Information3:</h3>
        <div className="lesson-details-name">
          <span className="title-objectives-label">Title EN:</span>
          {titleEn}
          <br />
          <span className="title-objectives-label">Title ES:</span>
          {(titleEs != 'null') ? <span>{titleEs}</span> : <span> Empty</span>}

          <div className="lesson-objectives">
            <span className="title-objectives-label">Objectives EN:</span>
            {objectivesEn != 'null' ? (
              <span>{objectivesEn}</span>
            ) : (
              <span> Empty</span>
            )}
            <br />
            <span className="title-objectives-label"> Objectives ES:</span>
            {objectivesEs != 'null' ? (
              <span>{objectivesEs}</span>
            ) : (
              <span> Empty</span>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="lesson-is-active">
          <span>Status:</span>
          {draft? <span>Ready for use</span> : <span>Draft</span>}
          {
            <i
              className={classNames("glyphicon", {
                "glyphicon-ok": draft,
                "glyphicon-remove": !draft
              })}
            />
          }
        </div>
      </section>

      <section>
        <a href={`${window.location.origin}/games/${id}`}>{`${
          window.location.origin
        }/games/${id}`}</a>
      </section>

      <section className="lesson-presentation-preview">
        <h3 className="lesson-details-title">Presentation Mode:</h3>
        <div className="sorting-form-container">
          <div className="row">
            {presentation.slides && renderSlides(presentation.slides)}
          </div>
        </div>
      </section>

      <br />
      <section className="lesson-elements">
        <h3 className="lesson-details-title">Sorting:</h3>
        {sorting &&
          sorting.elements &&
          sorting.elements.map(el => (
            <div className="element-card" key={el.id}>
              <div className="element-details">
                <div className="media-left media-middle">
                  {el.media && (
                    <img
                      className="media-object element-img"
                      src={el.media}
                      alt="preview"
                    />
                  )}
                </div>
                <div className="media-body">
                  <h4 className="media-heading">{el.titleEn}</h4>
                  <p>{el.objectivesEn}</p>
                  {sorting.hasTimer ? (
                    <p className="timer">
                      Timer:{sorting.time}
                      {sorting.timeValue}
                    </p>
                  ) : (
                    <p>No timer</p>
                  )}
                  <span className="correct">Is correct:</span>
                  {
                    <i
                      className={classNames("glyphicon", {
                        "glyphicon-ok": el.isCorrect,
                        "glyphicon-remove": !el.isCorrect
                      })}
                    />
                  }
                </div>
              </div>
            </div>
          ))}
        <div className="row">
          <div className="sorting-layout-settings">
            <div className="col-md-3">
              <h4>Background</h4>

              {sorting.background !== null ? (
                <img src={sorting.background} alt="" />
              ) : (
                <div className="media-object empty">
                  <i className="ti-file" />
                </div>
              )}
            </div>

            <div className="col-md-3">
              <h4>Correct Area</h4>
              {sorting.targetArea !== null ? (
                <img src={sorting.targetArea} alt="" />
              ) : (
                <div className="media-object empty">
                  <i className="ti-file" />
                </div>
              )}
            </div>

            <div className="col-md-3">
              <h4>Trash bucket area</h4>
              {sorting.bucket !== null ? (
                <img src={sorting.bucket} alt="" />
              ) : (
                <div className="media-object empty">
                  <i className="ti-file" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-details-quiz">
        <h3 className="lesson-details-title">Quiz: </h3>
        <div className="quiz-container">
          <ul>{quiz.questions && renderQuestions(quiz.questions)}</ul>
        </div>
      </section>
      <section>
        <h3 className="lesson-details-title">Invited students</h3>
        <ul>{invite.students && renderStudents(invite.students)}</ul>
      </section>
    </div>

    <div className="row buttons">
      <div className="pull-right">
        <Link to={`/dashboard/lessons/${id}/edit`} className="tch-link">
          Edit
        </Link>
        <button
          onClick={() => onRemove(id, creationDate)}
          className="btn-thc btn-thc-danger "
        >
          Remove
        </button>
      </div>
    </div>
  </Page>
)

export default LessonDetails
