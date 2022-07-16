const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({
    name,
    year,
  }) {
    const id = nanoid(16);
    const query = 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id';
    const values = [id, name, year];
    const result = await this._pool.query(query, values);
    if (result.rowCount === 0) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return {
      albumId: result.rows[0].id,
    };
  }

  async getAlbums() {
    const query = 'SELECT * FROM albums';
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getAlbum(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const songQuery = {
      text: 'SELECT * FROM songs WHERE albumid = $1',
      values: [id],
    };
    const songResult = await this._pool.query(songQuery);

    if (result.rowCount === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return result.rows.map(({
      albumId, name, year,
    }) => ({
      albumId,
      name,
      year,
      ...(songResult.rowCount > 0 && {
        songs: songResult.rows.map((row) => ({
          id: row.id,
          title: row.title,
          performer: row.performer,
        })),
      }),
    }))[0];
  }

  async updateAlbum(id, {
    name,
    year,
  }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return result.rows[0];
  }

  async deleteAlbum(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = AlbumService;
