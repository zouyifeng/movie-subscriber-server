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

  // 找到所有用户
  public static async findAdminUser (username: string, password: string): Promise<Array<any>> {
    return await getConnection('movie').query(`select * from admin_user where username='${username}' AND password='${password}'`)
  }

  // 分页查询
  public static async register(username: string, password: string): Promise<any> {
    console.log('password: ', password);
    console.log('username: ', username);
    console.log(`INSERT INTO admin_user (password, username) VALUES (${password}, ${username})`);
    // return getConnection('movie').query(`SELECT * from movie order by id limit ${pageSize * (pageIndex - 1)}, ${pageSize}`)
    return await getConnection('movie').query(`INSERT INTO admin_user (password, username) VALUES ('${password}', '${username}')`);
  }
}