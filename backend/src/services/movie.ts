import { injectable } from 'inversify';
import { Movie } from '../entities/movie';
import { getManager, getConnection, Equal } from 'typeorm';
import { DBConnection } from '../DBConnection'


@injectable()
export class MovieService {
  public static async newMovie(movie: Movie) {
    getConnection('movie').getRepository('movie').save(movie);
  }
  // 找到最新的电影
  public static async findLastestMovie(): Promise<any> {
    return getConnection('movie').getRepository('movie').findOne()
  }

  // 找到最新的电影
  public static async findLastestMovies(): Promise<any> {
    return getConnection('movie').getRepository('movie').find({
      take: 10
    })
  }
}
