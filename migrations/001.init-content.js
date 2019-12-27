exports.up = pgm => {
  /**
    Create service datatable corresponding to this SQL statement
    CREATE TABLE webapp (
    id serial PRIMARY KEY,
    slug varchar(255) NOT NULL UNIQUE,
    name varchar(255) NOT NULL,
    description text,
    repository text,
    token varchar(255)
    );
  */
  pgm.createTable('webapp', {
    id: { primaryKey: true, type: 'serial' },
    slug: { type: 'varchar(255)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    repository: { type: 'text' },
    token: { type: 'varchar(255)' }
  })

  /**
    Create build datatable corresponding to this SQL statement
    CREATE TABLE build (
    id varchar(255) PRIMARY KEY,
    webapp_id integer,
    name varchar(255) NOT NULL,
    url text,
    created_at timestamp,
    deleted boolean
    );
  */
  pgm.createTable('build', {
    id: { primaryKey: true, type: 'varchar(255)' },
    webapp_id: { type: 'integer' },
    name: { type: 'varchar(255)', notNull: true },
    url: { type: 'text' },
    deleted: { type: 'boolean', default: false },
    created_at: { type: 'timestamp' }
  })

  /**
    Create service datatable corresponding to this SQL statement
    CREATE TABLE vstage (
    vstage varchar(255) PRIMARY KEY,
    webapp_id integer PRIMARY KEY,
    build_id varchar(255)
    );
  */
  pgm.createTable('vstage', {
    vstage: { primaryKey: true, type: 'varchar(255)' },
    webapp_id: { primaryKey: true, type: 'integer' },
    build_id: { type: 'varchar(255)' }
  })
}

exports.down = pgm => {
  pgm.dropTable('vstage', {
    ifExists: true
  })

  pgm.dropTable('build', {
    ifExists: true
  })

  pgm.dropTable('webapp', {
    ifExists: true
  })
}
