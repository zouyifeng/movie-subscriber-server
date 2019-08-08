import { injectable } from 'inversify';
import { Movie } from '../entities/movie';
import { getManager, getConnection, Equal } from 'typeorm';
import { DBConnection } from '../DBConnection'
const logger = require('../log').logger('services/movie.ts', 'warn')

@injectable()
export class MovieService {
  public static async newMovie(movie: Movie) {
    // getConnection('movie').getRepository('movie').save(movie);
    // logger.info(`INSERT INTO movie (
    //   title, intro, cover, actor, country, publish_time, rate, create_time, download_url, type
    // ) VALUES (
    //   "${movie.title}", 
    //   "${movie.intro}", 
    //   "${movie.cover}", 
    //   "${movie.actor}", 
    //   "${movie.country}", 
    //   "${movie.publish_time}", 
    //   "${movie.rate}", 
    //   "${movie.create_time}", 
    //   "${movie.download_url}",
    //   "${movie.type}"
    // )`)
    console.log(`INSERT INTO movie (
      title, intro, cover, actor, country, publish_time, rate, create_time, download_url, type
    ) VALUES (
      "${movie.title}", 
      "${movie.intro}", 
      "${movie.cover}", 
      "${movie.actor}", 
      "${movie.country}", 
      "${movie.publish_time}", 
      "${movie.rate}", 
      "${movie.create_time}", 
      "${movie.download_url}",
      "${movie.type}"
    )`);
    getConnection('movie').query(`INSERT INTO movie (
      title, intro, cover, actor, country, publish_time, rate, create_time, download_url, type
    ) VALUES (
      '${movie.title}', 
      '${movie.intro}', 
      '${movie.cover}', 
      '${movie.actor}', 
      '${movie.country}', 
      '${movie.publish_time}', 
      '${movie.rate}', 
      '${movie.create_time}', 
      '${movie.download_url}',
      '${movie.type}'
    )`)
    
  }
  // 找到最新的电影
  public static async findLastestMovie(): Promise<any> {
    // return getConnection('movie').getRepository('movie').findOne()
    return getConnection('movie').query(`SELECT * FROM movie ORDER BY id DESC LIMIT 1`)
  }

  // 找到最新的电影
  public static async findLastestMovies(): Promise<any> {
    return getConnection('movie').query(`SELECT * FROM movie ORDER BY id DESC LIMIT 10`)
    // return getConnection('movie').getRepository('movie').find({
    //   take: 10
    // })
  }
}
