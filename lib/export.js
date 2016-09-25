const knex = require('knex')
const through = require('through2')
const File = require('vinyl')
const vfs = require('vinyl-fs')

module.exports = function exportTable (table, opts) {
  const outputDir = opts.output || `./${table}`
  const db = knex({
    client: opts.client,
    connection: opts.connection
  })

  db.select('*').from(table).stream()
    .pipe(through.obj(chunkToFiles(opts.key)))
    .pipe(vfs.dest(outputDir))
    .on('end', () => db.destroy())
}

function chunkToFiles (primaryKey) {
  return function (chunk, enc, callback) {
    const primaryKeyValue = chunk[primaryKey]

    const keys = Object.keys(chunk)
    keys.forEach((key) => {
      const file = new File({
        path: `./${primaryKeyValue}/${key}`,
        contents: new Buffer(chunk[key] + '')
      })
      this.push(file)
    })
    callback()
  }
}
