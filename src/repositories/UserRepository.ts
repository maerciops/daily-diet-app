import { Knex } from 'knex'
import { z } from 'zod'
import { CreateUserSchema } from '../schema/UserSchema'

export type User = z.infer<typeof CreateUserSchema>

export interface UserInput {
  id: string
  name: string
  password: string
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
    const user = await this.knex('users').where('name', name).first()

    if (!user) {
      throw new Error('Usuário já cadastrado.')
    } else {
      return user
    }
  }
}
