const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getAlbumHandler = this.getAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.putAlbumHandler = this.putAlbumHandler.bind(this);
        this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
    }

    async getAlbumsHandler () {
        const albums = await this._service.getAlbums()
        return {
            statusCode: 200,
            body: {
                status: 'success',
                data: {
                    albums,
                }
            }
        }
    }

    async getAlbumHandler(request, h) {
        try {
            const { id } = request.params;
            const album = await this._service.getAlbum(id);
            return {
                status: 'success',
                statusCode: 200,
                data: {
                    album
                }
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
            console.log(error)
            response.code(500)
            return response
        }
    }

    async postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload)
            const { name, year } = request.payload;
            const album = await this._service.addAlbum(
                {name, year}
            );
            const response = h.response({
                status: 'success',
                data: {
                    status: 'success',
                    albumId: album.albumId,
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

    async putAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload)
            const { id } = request.params;
            const { name, year } = request.payload;
            const album = await this._service.updateAlbum(id, {
                name,
                year,
            });
            return {
                statusCode: 200,
                status: 'success',
                message: 'Success',
                data: {
                    album
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

    async deleteAlbumHandler(request, h) {
        try {
            const { id } = request.params;
            const album = await this._service.deleteAlbum(id);
            return {
                status: 'success',
                message: 'Yang penting string :PPPPP',
                statusCode: 200,
                body: {
                    data: {
                        album,
                    }
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
}

module.exports = AlbumsHandler;