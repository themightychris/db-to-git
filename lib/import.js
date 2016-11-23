// const knex = require('knex')
const vfs = require('vinyl-fs')
const map = require('map-stream')
// const through = require('through2')

module.exports = function importTable (directory, opts) {
  // const table = opts.table || directory.split('/').pop()
  // const db = knex({
  //   client: opts.client,
  //   connection: opts.connection
  // })

  vfs.src(directory)
    // .pipe(map(log))
    // .pipe(vfs.dest('./output'))
    .pipe(through.obj((chunk, enc, callback) => {
      const parts = chunk.path.split('/')
      const field = parts.pop()
      const primaryKeyValue = parts.pop()
      rows[primaryKeyValue] = rows[primaryKeyValue] || {}
      rows[primaryKeyValue][field] += chunk.contents
      // this.push() ??

      callback()
    }))
}

function log (file, cb) {
  console.log(file.path)
  cb(null, file)
}
