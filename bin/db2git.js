require('dotenv').config({ silent: true })
const meow = require('meow')

const exportTable = require('../lib/export')

const help = `
  Usage
    $ db2git export <table> [--key=id] [--output=./<table>]

  Options
    -o --output <directory>    Path to output directory [default: (table name)]
    -k --key <primarykey>      Unique column to use as directory names [default: id]

  Examples:
    db2git export users -pk user_id -o ./users
`
const cli = meow(help, {
  alias: {
    o: 'output',
    k: 'key'
  },
  default: {
    key: 'id'
  }
})

const command = cli.input.length && cli.input[0]
const table = cli.input.length && cli.input[1]

const opts = Object.assign({}, cli.flags, {
  client: process.env.DB_CLIENT,
  connection: process.env.DB_CONNECTION
})

if (command === 'export' && table) {
  exportTable(table, opts)
} else {
  cli.showHelp()
}
