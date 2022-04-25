export const up = (knex) => (
    knex.schema.createTable('task_labels_relations', (table) => {
      table.increments('id').primary();
      table.integer('task_id').unsigned().index().references('id')
        .inTable('tasks');
      table.integer('label_id').unsigned().index().references('id')
        .inTable('task_labels');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  );
  
  export const down = (knex) => knex.schema.dropTable('task_labels_relations');
  