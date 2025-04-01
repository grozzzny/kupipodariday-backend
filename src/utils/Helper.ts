import * as bcrypt from 'bcrypt'

export default class Helper {
  static hashedPassword(password: string) {
    return bcrypt.hash(password, 10)
  }
}
