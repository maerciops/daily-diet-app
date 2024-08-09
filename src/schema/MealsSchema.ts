import { z } from 'zod'

export const CreateMealsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  date: z.date(),
  time: z.date(),    
  in_diet: z.boolean(),
})