function _createTasks () {
  let tasks = require('./tasks')

  for (let i = 0; i < tasks.length; i++) {
    let taskName = tasks[i]
    let task = tasks[i] = require('./' + taskName)
    task.name = taskName
  }

  return tasks
}

module.exports = require('task-list').create({
  tasks: _createTasks(),
  logger: {
    info (message) {
      console.log('INFO: ' + message)
    },

    success (message) {
      console.log('SUCCESS: ' + message)
    },

    error (message) {
      console.error('ERROR: ' + message)
    }
  }
})
