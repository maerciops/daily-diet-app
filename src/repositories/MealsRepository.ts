import { Knex } from 'knex'
import { z } from 'zod'
import { CreateMealsSchema, GetMealsSchema, MetricsMealsSchema } from '../schema/MealsSchema'

export type Meals = z.infer<typeof CreateMealsSchema>
export type EditMeals = z.infer<typeof GetMealsSchema>
export type MetricsMeals = z.infer<typeof MetricsMealsSchema>
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
    return result
  }  

  async getMealById(id: string, user_id: string): Promise<EditMeals> {
    const meal = await this.knex('meals').where('id', id).andWhere('user_id', user_id).first()
    return meal
  }  

  async getMealByUser(user_id: string): Promise<EditMeals[]> {
    const meal = await this.knex('meals').where('user_id', user_id)
    return meal
  }  
  
  async getTotalMeal(user_id: string): Promise<MetricsMeals | number> {
    const totalMeals = await this.knex('meals').where('user_id', user_id).count<number>('* AS totalMeals')

    if (totalMeals[0].totalMeals === 0) {
      return 0
    }

    const totalMealsInDiet = await this.knex('meals').where('user_id', user_id).where('in_diet', true).count<number>('* AS totalMealsInDiet')
    const totalMealsNotInDiet = await this.knex('meals').where('user_id', user_id).where('in_diet', false).count<number>('* AS totalMealsNotInDiet')
    const bestSeqInDiet = await this.knex.raw(`
      SELECT COUNT(*) AS bestSeqInDiet
      FROM (
        SELECT *,
               ROW_NUMBER() OVER (ORDER BY id) - 
               ROW_NUMBER() OVER (PARTITION BY (CASE WHEN in_diet = 1 THEN 1 ELSE 0 END) ORDER BY id) AS seq_id
        FROM meals
      ) AS subquery
      WHERE in_diet = 1 
      GROUP BY seq_id
      ORDER BY bestSeqInDiet DESC
      LIMIT 1
    `)
    const percMealsInDiet = totalMealsInDiet[0].totalMealsInDiet / totalMeals[0].totalMeals * 100
    
    const result = {
      totalMeals: totalMeals[0].totalMeals,
      totalMealsInDiet: totalMealsInDiet[0].totalMealsInDiet,
      totalMealsNotInDiet: totalMealsNotInDiet[0].totalMealsNotInDiet,
      bestSeqInDiet: bestSeqInDiet[0].bestSeqInDiet,
      percMealsInDiet: percMealsInDiet.toFixed(2),
    }

    return result 
  }   
}