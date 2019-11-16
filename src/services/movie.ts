import { injectable } from 'inversify';
import { Movie } from '../entities/movie';
import { getManager, getConnection, Equal, getConnectionOptions } from 'typeorm';
import { DBConnection } from '../DBConnection'
const logger = require('../log').logger('services/movie.ts', 'warn')

@injectable()
export class MovieService {
  public static async newMovie(movie: Movie) {
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
    return getConnection('movie').query(`SELECT * FROM movie ORDER BY id DESC LIMIT 1`)
  }

  // 找到最新的电影
  public static async findLastestMovies(): Promise<any> {
    return getConnection('movie').query(`SELECT * FROM movie ORDER BY id DESC LIMIT 10`)
  }

  // 获取电影详情
  public static async findMovie(id: string): Promise<any> {
    return getConnection('movie').query(`SELECT * from movie where id = ${id}`)
  }

  // 分页查询
  public static async getByMovieByPage(pageIndex: number, pageSize: number): Promise<any> {
    const list = await getConnection('movie').query(`SELECT * from movie order by id limit ${pageSize * (pageIndex - 1)}, ${pageSize}`)
    let total = await getConnection('movie').query(`SELECT count(1) FROM movie`)
    total = Number(total[0]['count(1)'])
    return { list, total }
  }

}
