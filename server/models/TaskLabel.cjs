// @ts-check

const objectionUnique = require('objection-unique');
const BaseModel = require('./BaseModel.cjs');

const unique = objectionUnique({ fields: ['name'] });

module.exports = class TaskLabel extends unique(BaseModel) {
  static get tableName() {
    return 'task_labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'Task.cjs',
        join: {
          from: 'labels.id',
          through: {
            from: 'task_labels.labelId',
            to: 'task_labels.taskId',
          },
          to: 'tasks.id',
        },
      },
    };
  }
};
