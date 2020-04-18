exports.up = pgm => {
  /**
    CREATE TABLE user (
      id serial PRIMARY KEY,
      username varchar(255) NOT NULL UNIQUE,
      email varchar(255) NOT NULL UNIQUE,
      password varchar(255) NOT NULL,
      id_photo serial DEFAULT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    );
  */
  pgm.createTable('user', {
    id: { primaryKey: true, type: 'serial' },
    username: { type: 'varchar(255)', notNull: true, unique: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    id_photo: { type: 'serial', DEFAULT: null },
    created_at: { type: 'timestamp', DEFAULT: Date.now() }
  })

  /**
    CREATE TABLE photo (
      id serial PRIMARY KEY,
      id_user serial NOT NULL,
      id_challenge serial,
      description text,
      path text NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    );
  */
  pgm.createTable('photo', {
    id: { primaryKey: true, type: 'serial' },
    id_user: { primaryKey: true, type: 'serial', notNull: true },
    id_challenge: { primaryKey: true, type: 'serial' },
    description: { type: 'text' },
    path: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', DEFAULT: Date.now() }
  })

  /**
    CREATE TABLE like (
      id serial PRIMARY KEY,
      id_user serial NOT NULL,
      id_challenge serial,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    );
  */
  pgm.createTable('like', {
    id: { primaryKey: true, type: 'serial' },
    id_user: { primaryKey: true, type: 'serial', notNull: true },
    id_challenge: { primaryKey: true, type: 'serial' },
    created_at: { type: 'timestamp', DEFAULT: Date.now() }
  })

  /**
    CREATE TABLE challenge (
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      description text,
      date_start timestamp NOT NULL,
      date_end timestamp NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    );
  */
  pgm.createTable('challenge', {
    id: { primaryKey: true, type: 'serial' },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    date_start: { type: 'timestamp', notNull: true },
    date_end: { type: 'timestamp', notNull: true },
    created_at: { type: 'timestamp', DEFAULT: Date.now() }
  })
}

exports.down = pgm => {
  pgm.dropTable('user', {
    ifExists: true
  })

  pgm.dropTable('photo', {
    ifExists: true
  })

  pgm.dropTable('like', {
    ifExists: true
  })

  pgm.dropTable('challenge', {
    ifExists: true
  })
}
