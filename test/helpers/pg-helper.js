'use strict'

const migrationRunner = require('node-pg-migrate').default

const path = require('path')

const dbUser = process.env['JAKKADI_POSTGRES_USER']
const dbPass = process.env['JAKKADI_POSTGRES_PASSWORD']
const dbName = process.env['JAKKADI_POSTGRES_DATABASE']
const dbHost = process.env['JAKKADI_POSTGRES_HOST']

const databaseUrl = `postgres://${dbUser}:${dbPass}@${dbHost}:5432/${dbName}`

function dbUp () {
  const options = {
    databaseUrl,
    dir: path.resolve(__dirname, '../../', 'migrations'),
    migrationsTable: 'pgmigrations',
    direction: 'up',
    count: Infinity,
    log: () => {}
  }

  return migrationRunner(options)
    .catch(e => {
      console.log('error performing node-pg-migrate up! exiting 1')
      console.log(e)
      process.exit(1)
    })
}

function dbDown () {
  const options = {
    databaseUrl,
    dir: path.resolve(__dirname, '../../', 'migrations'),
    migrationsTable: 'pgmigrations',
    direction: 'down',
    count: Infinity,
    log: () => {}
  }

  return migrationRunner(options)
    .catch(e => {
      console.log('Error performing node-pg-migrate down! exiting 1')
      console.log(e)
      process.exit(1)
    })
}

module.exports = {
  dbUp,
  dbDown
}
