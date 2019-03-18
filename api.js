const UploadResource = require('./api/Upload/Resource/UploadResource')
const FileResource = require('./api/Files/Resource/FileResource')
const LessonResource = require('./api/Lessons/Resource/LessonResource')
const StatisticResource = require('./api/Statisctics/Resource/StatisticResource')
const AuthResource = require('./api/Auth/Resource/AuthResource')
const SubjectsResource = require('./api/Subjects/Resource/SubjectsResource')
const StudentsResource = require('./api/Students/Resource/StudentsResource')
const ElementsResource = require('./api/Elements/Resource/ElementsResource')
const StandardsResource = require('./api/Standards/Resource/StandardsResource')
const LevelsResource = require('./api/Levels/Resource/LevelsResource')

const config = require('./config.json')
module.exports = app => {
  const mapRoute = (url, resource) => {
    app.use(`${config.api.prefix}/${url}`, resource)
  }
  mapRoute(`upload`, UploadResource)
  mapRoute(`files`, FileResource)
  mapRoute(`lessons`, LessonResource)
  mapRoute(`statistic`, StatisticResource)
  mapRoute(`auth`, AuthResource)
  mapRoute(`subjects`, SubjectsResource)
  mapRoute(`students`, StudentsResource)
  mapRoute(`elements`, ElementsResource)
  mapRoute(`standards`, StandardsResource)
  mapRoute(`levels`, LevelsResource)
}
