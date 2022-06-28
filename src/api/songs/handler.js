const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator

        this.getSongsHandler = this.getSongsHandler.bind(this)
        this.getSongHandler = this.getSongHandler.bind(this)
        this.postSongHandler = this.postSongHandler.bind(this)
        this.putSongHandler = this.putSongHandler.bind(this)
        this.deleteSongHandler = this.deleteSongHandler.bind(this)
    }

    async getSongsHandler(request,h) {
        try {
            const songs = await this._service.getSongs()
            return {
                status: 'success',
                statusCode: 200,
                    data: {
                        songs,
                    },
            }

        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                status: 'fail',
                message: 'Internal Server Error',
            })
            response.code(500)
            return response
        }
    }

    async getSongHandler(request,h){
        try {
            const { id } = request.params;
            const song = await this._service.getSong(id, {...request.query});
            return {
                status: 'success',
                statusCode: 200,
                data: {
                    song
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                console.log(error)
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                status: 'fail',
                message: 'Internal Server Error',
            })
            console.log(error)
            response.code(500)
            return response
        }
    }

    async postSongHandler(request,h) {
        try {
            this._validator.validateSongPayload(request.payload)
            const { title, year, genre, performer, duration, albumId } = request.payload;
            const song = await this._service.addSong(
                {title, year, genre, performer, duration, albumId}
            );
            const response = h.response({
                status: 'success',
                data: {
                    status: 'success',
                    songId: song.songId,
                }
            })
            response.code(201)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                console.log(error)
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                status: 'fail',
                message: 'Internal Server Error',
            })
            console.log(error)
            response.code(500)
            return response
        }
    }

    async putSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload)
            const { id } = request.params;
            const { title, year, genre, performer, duration, albumId } = request.payload;
            const song = await this._service.updateSong(
                id,
                {title, year, genre, performer, duration, albumId}
            );
            const response = h.response({
                status: 'success',
                message: 'success',
                data: {
                    status: 'success',
                    songId: song.id,
                }
            })
            response.code(200)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                console.log(error)
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                status: 'fail',
                message: 'Internal Server Error',
            })
            console.log(error)
            response.code(500)
            return response
        }
    }

    async deleteSongHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.deleteSong(id);
            const response = h.response({
                status: 'success',
                message: 'success',
                data: {
                    status: 'success',
                    songId: song.id,
                }
            })
            response.code(200)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                console.error(error)
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                status: 'fail',
                message: 'Internal Server Error',
            })
            console.error(error)
            response.code(500)
            return response
        }
    }
}

module.exports = SongsHandler;