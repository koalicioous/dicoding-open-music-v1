/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
        title: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        genre: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        performer: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        duration: {
            type: 'INTEGER',
            notNull: false,
        },
        albumid: {
            type: 'VARCHAR(50)',
            notNull: false,
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('songs')
};
