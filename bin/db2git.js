require('dotenv').config({ silent: true })
const meow = require('meow')

const exportTable = require('../lib/export')
const importTable = require('../lib/import')

const help = `
  Usage
    $ db2git export <table> [--key=id] [--output=./<table>]
    $ db2git import <directory> [--key=id] [--table=<directory>]

  Options
    -o --output <directory>    Path to output directory [default: (table name)]
    -t --table <table>         Table name to import into [default: (directory name)]
    -k --key <primarykey>      Unique column to use as directory names [default: id]

  Examples:
    db2git export users -pk user_id -o ./users
`
const cli = meow(help, {
  alias: {
    o: 'output',
    t: 'table',
    k: 'key'
  },
  default: {
    key: 'id'
  }
})

const command = cli.input.length && cli.input[0]
const argument = cli.input.length && cli.input[1]

const opts = Object.assign({}, cli.flags, {
  client: process.env.DB_CLIENT,
  connection: process.env.DB_CONNECTION
})

if (command === 'export' && argument) {
  exportTable(argument, opts)
} else if (command === 'import' && argument) {
  importTable(argument, opts)
} else {
  cli.showHelp()
}
