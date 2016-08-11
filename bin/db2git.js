require('dotenv').config({ silent: true })
const knex = require('knex')
const through = require('through2')
const File = require('vinyl')
const vfs = require('vinyl-fs')
const meow = require('meow')

const opts = {
  client: process.env.DB_CLIENT,
  connection: process.env.DB_CONNECTION
}

const help = `
  Usage
    $ db2git export <table> [--key=id] [--output=./<table>]

  Options
    -o --output <directory>         Path to output directory. Defaults to the name of the table.
    -k --key <primarykey>           Unique column to use as directory names.

  Examples:
    db2git export users -pk user_id -o ./users
`
const cli = meow(help, {
  alias: {
    o: 'output',
    k: 'key'
  }
})

const command = cli.input.length && cli.input[0]
const table = cli.input.length && cli.input[1]
const primaryKey = cli.flags.key || 'id'
const directory = cli.flags.output || './' + table

if (command === 'export' && table) {
  const client = knex({
    client: opts.client,
    connection: opts.connection
  })

  client.select('*').from(table).stream()
    .pipe(through.obj(chunkToFiles(primaryKey)))
    .pipe(vfs.dest(directory))
    .on('end', () => client.destroy())
} else {
  cli.showHelp()
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
