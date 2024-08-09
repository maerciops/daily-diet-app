import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('meals')

  await knex.schema.createTableIfNotExists('meals', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
    table.date('date').notNullable()
    table.time('time').notNullable()
    table.boolean('in_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('meals', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
    table.date('date').notNullable()
    table.time('time').notNullable()
    table.boolean('in_diet').notNullable()
  })

  await knex.schema.dropTableIfExists('meals')
}