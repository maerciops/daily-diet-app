import { Knex } from 'knex'
import { z } from 'zod'
import { CreateMealsSchema, GetMealsSchema } from '../schema/MealsSchema'

export type Meals = z.infer<typeof CreateMealsSchema>
export type EditMeals = z.infer<typeof GetMealsSchema>

export interface MealsInput {
  id: string
  name: string
  description: string
  date: Date
  time: Date
  in_diet: boolean
  user_id: string
}

export class MealsRepository {
  private knex: Knex

  constructor(knex: Knex) {
    this.knex = knex
  }

  async addMeal(input: MealsInput): Promise<Meals> {
    const [aMeal] = await this.knex('meals').insert(input, '*') 
    return aMeal
  }

  async editMeal(input: MealsInput): Promise<Meals> {
    const [aMeal] = await this.knex('meals').where('id', input.id).update(input, '*')
    return aMeal
  }

  async deleteMeal(id: string): Promise<number> {
    const result = await this.knex('meals').where('id', id).del()
    console.log(result)
    return result
  }  

  async getMealById(id: string): Promise<EditMeals> {
    const meal = await this.knex('meals').where('id', id).first()
    return meal
  }  
}