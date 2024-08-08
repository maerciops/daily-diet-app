import { Knex } from 'knex'
import { z } from 'zod'
import { UserSchema } from '../schema/UserSchema'

export type User = z.infer<typeof UserSchema>

export interface UserInput {
  id: string
  name: string
  hashedPassword: string
}

export class UserRepository {
  private knex: Knex

  constructor(knex: Knex) {
    this.knex = knex
  }

  async addUser(input: UserInput): Promise<User> {
    const userExists = await this.getUserByName(input.name)

    if (userExists) {
      throw new Error('Usuário já cadastrado.')
    }

    const [user] = await this.knex('users').insert(input, '*')
    return user
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await this.knex('users').where('id', id).first()
    return user
  }

  async getUserByName(name: string): Promise<User | undefined> {
    const user = await this.knex('users').where('name', name).first().select('name', 'hashedPassword', 'id')
    return user
  }
}
