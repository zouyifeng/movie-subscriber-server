import { DBConfig } from './Config'
import {createConnection, Connection} from "typeorm";
import { Movie } from './entities/movie'

export class DBConnection {
  constructor () {}
  /**
   * createConnection
   */
  public async createConnection() {
    const config: any = DBConfig
    return await createConnection({
      type: config.type,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      entities: [
        Movie
      ],
      synchronize: true,
    })
  }
}