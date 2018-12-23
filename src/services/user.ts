import { injectable } from 'inversify'
import { getConnection } from 'typeorm'
import { User } from '../entities/user'

@injectable()
export class UserService {
  public static newUser (user: User) {
    getConnection('movie').getRepository('user').save(user);
  }
}