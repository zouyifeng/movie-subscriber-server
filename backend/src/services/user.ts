import { injectable } from 'inversify'
import { getConnection } from 'typeorm'
import { User } from '../entities/user'

@injectable()
export class UserService {
  // 新建用户
  public static newUser (user: User) {
    getConnection('movie').getRepository('user').save(user);
  }
  // 找到所有用户
  public static async findAllUser (): Promise<Array<any>> {
    return await getConnection('movie').getRepository('user').find()
  } 
}