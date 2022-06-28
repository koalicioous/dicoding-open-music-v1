const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const InvariantError = require('../../../exceptions/InvariantError')
const NotFoundError = require('../../../exceptions/NotFoundError')

class SongService {
    constructor() {
        this._pool = new Pool()
    }

    async addSong({
        title,
        year,
        genre,
        performer,
        duration = '',
        albumId = '',
    }){
        const id = nanoid(16)
        const query =
            `INSERT INTO songs (id, title, year, genre, performer, duration, albumId) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
        const values = [id, title, year, genre, performer, duration, albumId]
        const result = await this._pool.query(query,values)
        if (result.rowCount === 0) {
            throw new InvariantError('Album gagal ditambahkan')
        }
        return {
            songId: result.rows[0].id
        }
    }

    async getSongs(){
        const query = 'SELECT * FROM songs'
        const result = await this._pool.query(query)
        return result.rows.map(row => {
            return {
                id: row.id,
                title: row.title,
                performer: row.performer,
            }
        })
    }

    async getSong(id, {
        title = '',
        performer = ''
    }){
        const query = {
            text: `SELECT * FROM songs WHERE id = $1 AND title LIKE '%${title}%' AND performer LIKE '%${performer}'`,
            values: [id],
        }
        const result = await this._pool.query(query)
        if(result.rowCount === 0){
            throw new NotFoundError('Song tidak ditemukan')
        }
        return result.rows[0]
    }

    async  updateSong(id, {
        title,
        year,
        genre,
        performer,
        duration = null,
        albumId = null,
    }) {
        const query = {
            text: `UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6 WHERE id = $7 returning id`,
            values: [title, year, genre, performer, duration, albumId, id],
        }
        const result = await this._pool.query(query)
        if(result.rowCount === 0){
            throw new NotFoundError('Song tidak ditemukan')
        }
        return result.rows[0]
    }

    async deleteSong(id){
        const query = {
            text: `DELETE FROM songs WHERE id = $1 returning id`,
            values: [id],
        }
        const result = await this._pool.query(query)
        if(result.rowCount === 0){
            throw new NotFoundError('Song tidak ditemukan')
        }
        return result.rows[0]
    }

}

module.exports = SongService;