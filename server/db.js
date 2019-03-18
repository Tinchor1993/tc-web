import AWS from 'aws-sdk'
import path from 'path'

AWS.config.loadFromPath(path.resolve(__dirname, '../awsconfig.json'))
AWS.config.setPromisesDependency(Promise);

export default callback => {
  const db = new AWS.DynamoDB.DocumentClient()
  const s3 = new AWS.S3()
  
  callback({
    db,
    s3
  })
}
