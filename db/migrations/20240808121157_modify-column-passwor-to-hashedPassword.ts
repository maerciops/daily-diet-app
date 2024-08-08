import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('users', (table) => {
    table.renameColumn('password', 'hashedPassword')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('users', (table) => {
    table.renameColumn('hashedPassword', 'password')
  })
}
