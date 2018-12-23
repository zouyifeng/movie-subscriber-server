import { Config } from './Config'
import {createConnection, Connection} from "typeorm";
import { Movie } from './entities/movie'
import { User } from './entities/user'

export class DBConnection {
  /**
   * createConnection
   */
  public static async createConnection() {
    const config: any = Config
    return await createConnection({
      name: 'movie',
      type: config.DB_TYPE,
      host: config.DB_HOST,
      port: config.DB_PORT,
      username: config.DB_USERNAME,
      password: config.DB_PASSWORD,
      database: config.DB_DATABASE,
      entities: [
        Movie,
        User
      ],
      synchronize: true,
      connectTimeout: 60 * 1000 * 1000,
      acquireTimeout: 60 * 1000 * 1000
    })
  }
}