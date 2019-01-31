import 'reflect-metadata';
import { DBConnection } from './DBConnection'
import * as schedule from 'node-schedule'
import app from './server'
import { fetchMovie } from './controllers/website'
const logger = require('./log').logger('index.ts', 'warn')

const port = 8089

DBConnection.createConnection()
  .then(() => {
    logger.info('数据库连接成功')
    schedule.scheduleJob('1 1 13 * * *', function() {
      fetchMovie()
    })
  })
  .catch(e => {
    logger.error('数据库连接错误')
    logger.error(e)
  })
 
app.listen(port, err => {
  if (err) {
    return logger.error(err)
  }
  return logger.info(`server is listening on ${port}`)
})
