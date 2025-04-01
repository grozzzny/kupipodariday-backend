import * as bcrypt from 'bcrypt'

export default class Helper {
  static hashedPassword(password) {
    return bcrypt.hash(password, 10)
  }
}
