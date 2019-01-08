import * as supertest from 'supertest'
import app from '../src/Server'

describe('App', () => {
  it('works', () =>
    supertest(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
  )
})
